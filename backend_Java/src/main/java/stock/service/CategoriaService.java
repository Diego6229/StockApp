package stock.service;

import java.util.List;
import org.springframework.stereotype.Service;
import stock.model.Categoria;
import stock.repository.CategoriaRepository;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> obtenerCategorias() {
        return this.categoriaRepository.findAll();
    }

    public Categoria obtenerPorId(Long id) {
        return (Categoria)this.categoriaRepository.findById(id).orElse(null);
    }

    public Categoria guardar(Categoria categoria) {
        return (Categoria)this.categoriaRepository.save(categoria);
    }
    public boolean existeCategoria(String nombre) {
        return categoriaRepository.findByNombre(nombre).isPresent();
    }

    public void eliminar(Long id) {
        this.categoriaRepository.deleteById(id);
    }
}
