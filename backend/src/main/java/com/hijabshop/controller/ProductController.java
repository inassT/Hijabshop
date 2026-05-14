package com.hijabshop.controller;

/**
 * COMPARAISON ARCHITECTURE WEB (SERVLET vs SPRING MVC) :
 * 
 * 1. Mapping des Requêtes :
 *    - SANS SPRING (SERVLET) : Il faudrait créer une classe étendant HttpServlet 
 *      et la configurer dans web.xml. Pour chaque type de requête (GET, POST), 
 *      il faudrait surcharger doGet() ou doPost().
 *    - AVEC SPRING MVC : On utilise des annotations simples comme @RestController 
 *      et @GetMapping, ce qui rend le code plus lisible et plus facile à tester.
 * 
 * 2. Gestion des Paramètres et du JSON :
 *    - SANS SPRING : Il faudrait extraire manuellement les paramètres de l'URL 
 *      (request.getParameter) et utiliser une bibliothèque comme Jackson ou GSON 
 *      pour transformer manuellement le corps de la requête (Body) en objet Java.
 *    - AVEC SPRING : Les annotations @PathVariable, @RequestParam et @RequestBody 
 *      automatisent totalement la conversion et l'injection des données.
 * 
 * 3. Réponse HTTP : Spring simplifie l'envoi de codes de statut (ResponseEntity) 
 *    et la sérialisation automatique des objets retournés en JSON.
 */

import com.hijabshop.model.Product;
import com.hijabshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Recherche avec filtres: GET /api/products/search?nom=&couleur=&prixMin=&prixMax=
    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String couleur,
            @RequestParam(required = false) Double prixMin,
            @RequestParam(required = false) Double prixMax
    ) {
        return productService.searchProducts(nom, couleur, prixMin, prixMax);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}

