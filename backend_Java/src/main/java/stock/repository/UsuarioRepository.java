package stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stock.model.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    //metodo para buscar usuario por nombre
    Optional<Usuario> findByNombre(String nombre);

}