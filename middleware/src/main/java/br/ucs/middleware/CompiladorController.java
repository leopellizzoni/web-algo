package br.ucs.middleware;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//@CrossOrigin(origins = {"http://localhost:3000"})
@RestController
@RequestMapping("/api")
public class CompiladorController {

    @PostMapping("/compilar")
    public ResponseEntity<String> compilar(@RequestBody CodigoRequest request, HttpServletRequest httpRequest) {
        System.out.println("=== Requisição Recebida ===");

        System.out.println("Body (CodigoRequest): " + request);

        System.out.println("Método: " + httpRequest.getMethod());

        System.out.println("URL: " + httpRequest.getRequestURL());

        System.out.println("Cabeçalhos:");
        httpRequest.getHeaderNames().asIterator()
                .forEachRemaining(headerName -> {
                    System.out.println(headerName + ": " + httpRequest.getHeader(headerName));
                });

        System.out.println("Parâmetros query:");
        httpRequest.getParameterMap().forEach((key, values) -> {
            System.out.println(key + ": " + String.join(", ", values));
        });

        System.out.println("Client ID: " + request.getClientId());

        System.out.println("==========================\n\n");

        return ResponseEntity.ok("Código recebido com sucesso!");
    }


    public static class CodigoRequest {
            private String clientId;

        public String getClientId() {
            return clientId;
        }

        public void setClientId(String clientId) {
            this.clientId = clientId;
        }
    }
}
