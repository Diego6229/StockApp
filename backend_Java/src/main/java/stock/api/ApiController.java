package stock.api;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stock.model.Categoria;
import stock.model.MovimientoStock;
import stock.model.Producto;
import stock.model.Usuario;
import stock.service.CategoriaService;
import stock.service.MovimientoStockService;
import stock.service.ProductoService;
import stock.service.UsuarioService;
import stock.model.UsuarioEditDTO;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController // Dice a SP que esta clase devuelve en JSON
@RequestMapping("/api") //Todas las rutas comienzan por /api

public class ApiController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private MovimientoStockService movimientoStockService;

    //---LOGIN---

    //POST Login
    //Se envia nombre y contraseña, recibe usuario si es correcto
    @PostMapping("/login")
    public Usuario login(@RequestParam String nombre, @RequestParam String password) {
        return usuarioService.login(nombre, password);
    }

    //---PRODUCTOS---

    //GET productos
    //la app recibe los productos
    @GetMapping("/productos")
    public List<Producto> obtenerProductos() {
        return productoService.obtenerProductos();
    }

    //POST ventas
    //Se envia el producto_id y el usuario_id
    @PostMapping("/venta/{idProducto}")
    public void registrarVenta(@PathVariable Long idProducto, @RequestParam Long idUsuario) {
        Producto producto = productoService.obtenerPorId(idProducto);
        Usuario usuario = usuarioService.obtenerUsuarioPorId(idUsuario);

        MovimientoStock movimientoStock = new MovimientoStock();
        movimientoStock.setTipo("SALIDA");
        movimientoStock.setCantidad(1);
        movimientoStock.setProducto(producto);
        movimientoStock.setUsuario(usuario);

        movimientoStockService.registrar(movimientoStock);
    }

    // POST añadir producto
    @PostMapping("/productos")
    public Producto añadirProducto(@RequestBody Producto producto) {
        return productoService.añadir(producto);
    }

    // PUT editar producto
    @PutMapping("/productos/{id}")
    public Producto editarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        producto.setId(id);
        return productoService.añadir(producto);
    }

    // DELETE eliminar producto
    @DeleteMapping("/productos/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoService.eliminarConMoviminetos(productoService.obtenerPorId(id));
    }


    //---CATEGORIAS---

    @Autowired
    private CategoriaService categoriaService;

    // GET categorías
    @GetMapping("/categorias")
    public List<Categoria> obtenerCategorias() {
        return categoriaService.obtenerCategorias();

    }

    // POST añadir categoría
    @PostMapping("/categorias")
    public Categoria añadirCategoria(@RequestBody Categoria categoria) {
        return categoriaService.guardar(categoria);
    }

    // PUT editar categoría
    @PutMapping("/categorias/{id}")
    public Categoria editarCategoria(@PathVariable Long id, @RequestBody Categoria categoria) {
        categoria.setId(id);
        return categoriaService.guardar(categoria);
    }

    // DELETE eliminar categoría (elimina también sus productos y movimientos)
    @DeleteMapping("/categorias/{id}")
    public void eliminarCategoria(@PathVariable Long id) {
        Categoria categoria = categoriaService.obtenerPorId(id);
        List<Producto> productos = productoService.obtenerProductosPorCategoria(categoria);
        for (Producto producto : productos) {
            productoService.eliminarConMoviminetos(producto);
        }
        categoriaService.eliminar(id);
    }

    //--- USUARIOS ---

    // GET usuarios
    @GetMapping("/usuarios")
    public List<Usuario> obtenerUsuarios() {
        return usuarioService.obtenerUsuarios();
    }

    // POST añadir usuario
    @PostMapping("/usuarios")
    public Usuario añadirUsuario(@RequestBody Usuario usuario) {
        usuario.setContraseña(BCrypt.hashpw(usuario.getContraseña(), BCrypt.gensalt()));
        return usuarioService.añadir(usuario);
    }

    // PUT editar usuario
    @PutMapping("/usuarios/{id}")
    public Usuario editarUsuario(@PathVariable Long id, @RequestBody UsuarioEditDTO dto) {
        Usuario existente = usuarioService.obtenerUsuarioPorId(id);
        existente.setNombre(dto.getNombre());
        existente.setRol(dto.getRol());
        existente.setFoto(dto.getFoto());
        if (dto.getContraseña() != null && !dto.getContraseña().isEmpty()) {
            existente.setContraseña(BCrypt.hashpw(dto.getContraseña(), BCrypt.gensalt()));
        }
        return usuarioService.añadir(existente);
    }

    // DELETE eliminar usuario
    @DeleteMapping("/usuarios/{id}")
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(usuarioService.obtenerUsuarioPorId(id));
    }

    @PostMapping("/usuarios/{id}/verificar-password")
    public boolean verificarPassword(@PathVariable Long id, @RequestParam String password) {
        Usuario usuario = usuarioService.obtenerUsuarioPorId(id);
        return BCrypt.checkpw(password, usuario.getContraseña());
    }

    //---ESTADISTICAS---

    // GET estadísticas
    @GetMapping("/estadisticas/mas-vendidos")
    public List<Map<String, Object>> masVendidos() {
        List<Map.Entry<Producto, Long>> vendidos = movimientoStockService.MasVendidos();
        List<Map<String, Object>> resultado = new java.util.ArrayList<>();
        for (Map.Entry<Producto, Long> entry : vendidos) {
            Map<String, Object> item = new java.util.HashMap<>();
            item.put("nombre", entry.getKey().getNombre());
            item.put("unidades", entry.getValue());
            item.put("precio", entry.getKey().getPrecio());
            resultado.add(item);
        }
        return resultado;
    }

    @GetMapping("/estadisticas/total-recaudado")
    public double totalRecaudado() {
        return movimientoStockService.totalRecaudado();
    }

    @GetMapping("/estadisticas/stock-bajo")
    public List<Producto> stockBajo() {
        return productoService.obtenerConBajoStock();
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        Map<String, Object> datos = new java.util.HashMap<>();
        datos.put("totalProductos", productoService.obtenerProductos().size());
        datos.put("totalCategorias", categoriaService.obtenerCategorias().size());
        datos.put("totalUsuarios", usuarioService.obtenerUsuarios().size());
        datos.put("totalRecaudado", movimientoStockService.totalRecaudado());
        datos.put("stockBajo", productoService.obtenerConBajoStock().size());
        return datos;
    }

}
