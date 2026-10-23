package stock.model;

public class UsuarioEditDTO {
    private String nombre;
    private String rol;
    private String contraseña;
    private String foto;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getContraseña() { return contraseña; }
    public void setContraseña(String contraseña) { this.contraseña = contraseña; }
    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
}