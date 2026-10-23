package stock.service;

import java.util.List;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import stock.model.Usuario;
import stock.repository.UsuarioRepository;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> obtenerUsuarios() {
        return this.usuarioRepository.findAll();
    }

    public Usuario obtenerUsuarioPorId(Long id) {
        return (Usuario)this.usuarioRepository.findById(id).orElse(null);
    }

    public Usuario añadir(Usuario usuario) {
        return (Usuario)this.usuarioRepository.save(usuario);
    }

    public void eliminar(Usuario usuario) {
        this.usuarioRepository.delete(usuario);
    }

    public Usuario login(String nombre, String contraseña){
        //Buscar usuario por nombre
        Optional<Usuario> resultado = usuarioRepository.findByNombre(nombre);

        //Si no existe devolver null
        if(resultado.isEmpty()){
            return null;
        }

        Usuario usuario = resultado.get();

        //Comparar contraseña
        if(BCrypt.checkpw(contraseña, usuario.getContraseña())){
            return usuario;
        }else{
            return null;
        }

    }
    public boolean existeUsuario(String nombre){
        return usuarioRepository.findByNombre(nombre).isPresent();

    }


}