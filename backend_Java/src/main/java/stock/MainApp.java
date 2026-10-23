package stock;

import java.awt.Desktop;
import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class MainApp {

    //Abrir el navegador al arrancar (se puede desactivar con app.abrir-navegador=false)
    @Value("${app.abrir-navegador:true}")
    private boolean abrirNavegador;

    @Value("${server.port:8080}")
    private int puerto;

    public static void main(String[] args) {
        //Punto de entrada. Arranca Spring Boot (API REST + web de React)
        //headless(false) permite usar Desktop para abrir el navegador
        new SpringApplicationBuilder(MainApp.class)
                .headless(false)
                .run(args);
    }

    //Se ejecuta cuando Spring ya esta listo para recibir peticiones
    @EventListener(ApplicationReadyEvent.class)
    public void abrirNavegador() {
        String url = "http://localhost:" + puerto;
        System.out.println("\n  StockApp disponible en " + url + "\n");

        if (!abrirNavegador) {
            return;
        }
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(url));
            }
        } catch (Exception e) {
            System.out.println("  No se pudo abrir el navegador automaticamente. Abre " + url);
        }
    }
}
