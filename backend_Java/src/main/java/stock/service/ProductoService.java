
package stock.service;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import stock.model.Categoria;
import stock.model.Producto;
import stock.repository.MovimientoStockRepository;
import stock.repository.ProductoRepository;

@Service
public class ProductoService {
    private final ProductoRepository productoRepository;
    private final MovimientoStockRepository movimientoStockRepository;

    public ProductoService(ProductoRepository productoRepository, MovimientoStockRepository movimientoStockRepository) {
        this.productoRepository = productoRepository;
        this.movimientoStockRepository = movimientoStockRepository;
    }

    public List<Producto> obtenerProductos() {
        return this.productoRepository.findAll();
    }

    public Producto obtenerPorId(Long id) {
        return (Producto)this.productoRepository.findById(id).get();
    }

    public Producto añadir(Producto producto) {
        return (Producto)this.productoRepository.save(producto);
    }

    public void eliminar(Long id) {
        this.productoRepository.deleteById(id);
    }

    public List<Producto> obtenerProductosPorCategoria(Categoria categoria) {
        return this.productoRepository.findByCategoria(categoria);
    }

    public List<Producto> obtenerConStockBajo() {
        return this.productoRepository.findAll().stream().filter((product) -> product.getStockActual() < product.getStockMinimo()).toList();
    }

    @Transactional // le dice a SP que envuelva el metodo en una transaccion.
    public void eliminarConMoviminetos(Producto producto) {
        //Eliminar primero los movimientos
        movimientoStockRepository.deleteByProducto(producto);

        //Despues eliminar producto
        productoRepository.delete(producto);
    }

    //Existe producto
    public boolean existeProducto(String nombre) {
        return productoRepository.findByNombre(nombre).isPresent();
    }

    //PRODUCTOS CON BAJO STOCK
    public List<Producto> obtenerConBajoStock(){
        return productoRepository.findAll().stream()
                .filter((product) -> product.getStockActual() < product.getStockMinimo())
                .collect(Collectors.toList());

    }
}