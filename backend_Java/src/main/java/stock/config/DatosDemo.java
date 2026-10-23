package stock.config;

import java.time.LocalDateTime;
import java.util.List;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import stock.model.Categoria;
import stock.model.MovimientoStock;
import stock.model.Producto;
import stock.model.Usuario;
import stock.repository.CategoriaRepository;
import stock.repository.MovimientoStockRepository;
import stock.repository.ProductoRepository;
import stock.repository.UsuarioRepository;

//Rellena la base de datos con datos de ejemplo la primera vez que se arranca (solo si no hay usuarios)
@Component
public class DatosDemo implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final MovimientoStockRepository movimientoStockRepository;

    public DatosDemo(UsuarioRepository usuarioRepository, CategoriaRepository categoriaRepository,
                     ProductoRepository productoRepository, MovimientoStockRepository movimientoStockRepository) {
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.movimientoStockRepository = movimientoStockRepository;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }

        //USUARIOS
        Usuario admin = crearUsuario("admin", "admin123", "ADMIN");
        Usuario empleado = crearUsuario("empleado", "empleado123", "EMPLEADO");

        //CATEGORIAS
        Categoria bebidas = categoriaRepository.save(new Categoria("Bebidas"));
        Categoria alimentacion = categoriaRepository.save(new Categoria("Alimentación"));
        Categoria calzado = categoriaRepository.save(new Categoria("Calzado"));

        //PRODUCTOS (nombre, precio, stock actual, stock minimo, categoria)
        Producto cocaCola = productoRepository.save(new Producto("Coca-Cola", 1.50, 48, 10, bebidas));
        Producto agua = productoRepository.save(new Producto("Agua mineral", 0.80, 120, 20, bebidas));
        Producto fanta = productoRepository.save(new Producto("Fanta naranja", 1.50, 6, 10, bebidas));
        Producto patatas = productoRepository.save(new Producto("Patatas fritas", 1.20, 35, 10, alimentacion));
        productoRepository.save(new Producto("Galletas", 2.10, 3, 8, alimentacion));
        Producto airForce = productoRepository.save(new Producto("Nike Air Force 1", 120.00, 14, 5, calzado));
        productoRepository.save(new Producto("Nike Air Max 95", 150.00, 9, 5, calzado));

        //VENTAS de ejemplo para que el dashboard y las estadisticas tengan datos
        List<Producto> vendidos = List.of(cocaCola, cocaCola, cocaCola, cocaCola, agua, agua, agua,
                patatas, patatas, fanta, airForce, airForce);
        for (Producto producto : vendidos) {
            movimientoStockRepository.save(new MovimientoStock("SALIDA", 1, LocalDateTime.now(), producto, empleado));
        }

        System.out.println("  Datos demo creados. Usuarios: admin/admin123 (ADMIN) y empleado/empleado123");
    }

    private Usuario crearUsuario(String nombre, String password, String rol) {
        Usuario usuario = new Usuario(nombre, rol);
        usuario.setContraseña(BCrypt.hashpw(password, BCrypt.gensalt()));
        return usuarioRepository.save(usuario);
    }
}
