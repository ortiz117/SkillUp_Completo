package com.skillup.backend.controller;

import com.skillup.backend.model.User;
import com.skillup.backend.service.UserService;
import com.skillup.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Considera cambiar "*" por la URL de tu frontend en producción
public class AuthController {

    @Autowired
    private UserService userService;

    // ¡CAMBIO! Inyectamos el proveedor correcto
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // La lógica aquí está bien, pero asegúrate que el JSON del frontend coincida
        return ResponseEntity.ok(userService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");

        Optional<User> user = userService.login(email, password);
        if (user.isPresent()) {
            // ¡CAMBIO! Usamos el método del proveedor correcto
            String token = jwtTokenProvider.generateToken(user.get().getEmail());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", user.get()
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }
    }
}