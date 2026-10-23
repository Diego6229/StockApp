package stock.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

//Devuelve la web de React para sus rutas, asi al recargar la pagina (F5) no da error 404
@Controller
public class SpaController {

    @GetMapping({"/", "/login", "/dashboard", "/productos", "/categorias", "/usuarios", "/estadisticas"})
    public String index() {
        return "forward:/index.html";
    }
}
