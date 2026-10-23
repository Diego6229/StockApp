package stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import stock.model.MovimientoStock;
import stock.model.Producto;

import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Long> {
    void deleteByProducto(Producto producto);

    //Obtener movimientos de salida del mes
    @Query("SELECT movimientos FROM MovimientoStock  movimientos WHERE movimientos.tipo = 'SALIDA' AND movimientos.fecha >= :fechaInicio")
    List<MovimientoStock> obtenerVentasDesde(@Param("fechaInicio") LocalDateTime fechaInicio);
}