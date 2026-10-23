package stock.model;

import jakarta.persistence.*;

@Entity //Clase a tabla
@Table(name = "categorias") //nombre en BD
public class Categoria {

    @Id //primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Autoincrementa el id
    private Long id;
    private String nombre;

    //Constructor vacio
    public Categoria() {}

    public Categoria(String nombre) {
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Hace que solo aparezca el nombre en el comboBox
    @Override
    public String toString() {
        return nombre;
    }
}

