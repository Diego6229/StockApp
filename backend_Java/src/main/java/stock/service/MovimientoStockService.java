package stock.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import stock.model.MovimientoStock;
import stock.model.Producto;
import stock.repository.MovimientoStockRepository;
import stock.repository.ProductoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovimientoStockService {
    private final MovimientoStockRepository movimientoStockRepository;
    private final ProductoRepository productoRepository;



    public MovimientoStockService(MovimientoStockRepository movimientoStockRepository, ProductoRepository productoRepository) {
        this.movimientoStockRepository = movimientoStockRepository;
        this.productoRepository = productoRepository;
    }

    public List<MovimientoStock> obtenerMovimientos() {
        return this.movimientoStockRepository.findAll();
    }

    public MovimientoStock registrar(MovimientoStock movimientoStock) {

        //Buscar el producto
        Optional<Producto> resultado = productoRepository.findById(movimientoStock.getProducto().getId());
        if(resultado.isEmpty()){
            throw new RuntimeException("Producto no encontrado");
        }

        Producto producto = resultado.get();

        //Logica segun ENTRADA/SALIDA
        if(movimientoStock.getTipo().equals("ENTRADA")){
            producto.setStockActual(producto.getStockActual() + movimientoStock.getCantidad());

        }else if(movimientoStock.getTipo().equals("SALIDA")){
            if(producto.getStockActual() < movimientoStock.getCantidad()) {
                throw new RuntimeException("Stock insuficiente. Disponible: " + producto.getStockActual() + ", solicitado: " + movimientoStock.getCantidad());
            }

            producto.setStockActual(producto.getStockActual() - movimientoStock.getCantidad());
            }

            // Guardar producto con stock actualizado
            productoRepository.save(producto);

            //Establecer fecha y guardar movimiento
            movimientoStock.setFecha(LocalDateTime.now());
            return movimientoStockRepository.save(movimientoStock);
        }

        @Transactional
        public void eliminarPorProducto(Producto producto) {
            movimientoStockRepository.deleteByProducto(producto);
        }


        //PRODUCTOS MAS Y MENOS VENDIDOS DEL MES
        public List<Map.Entry<Producto, Long>> MasVendidos(){
            //Calcular primer dia del mes
            LocalDateTime inicioMes = LocalDateTime.now()
                    .withDayOfMonth(1)
                    .withHour(0)
                    .withMinute(0)
                    .withSecond(0);

            //Pedir a la BD todas las SALIDAS
            List<MovimientoStock> ventas = movimientoStockRepository.obtenerVentasDesde(inicioMes);

            //Agrupar por producto y contar ventas de cada uno
            Map<Producto, Long> contar = ventas.stream()
                    .collect(Collectors.groupingBy(MovimientoStock::getProducto, Collectors.counting()));

            //Ordenar de mayor a menor
            return contar.entrySet().stream()
                    .sorted(Map.Entry.<Producto, Long>comparingByValue().reversed())
                    .collect(Collectors.toList());
    }

        //TOTAL RECAUDADO ESTE MES
        public double totalRecaudado(){
            //Calcular primer dia del mes
            LocalDateTime inicioMes = LocalDateTime.now()
                    .withDayOfMonth(1)
                    .withHour(0)
                    .withMinute(0)
                    .withSecond(0);

            //Pedir todas las ventas del mes
            List<MovimientoStock> ventas = movimientoStockRepository.obtenerVentasDesde(inicioMes);

            //Calcular total ( (precio-producto * cantidad vendida) despues sumar todo)
            return ventas.stream()
                    .mapToDouble(movimiento -> movimiento.getProducto().getPrecio() * movimiento.getCantidad()).sum();

        }
    }






