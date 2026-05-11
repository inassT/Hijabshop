package com.hijabshop.service;

import com.hijabshop.model.Product;
import com.hijabshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setNom(updatedProduct.getNom());
            product.setDescription(updatedProduct.getDescription());
            product.setPrix(updatedProduct.getPrix());
            product.setCouleur(updatedProduct.getCouleur());
            product.setImage(updatedProduct.getImage());
            product.setStock(updatedProduct.getStock());
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Produit non trouvé"));
    }

    public void deleteProduct(Long id) {
        try {
            productRepository.deleteById(id);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new RuntimeException("Ce produit ne peut pas être supprimé car il est lié à des commandes existantes. Vous devriez plutôt réduire son stock à 0.");
        }
    }

    public List<Product> searchProducts(String nom, String couleur, Double prixMin, Double prixMax) {
        return productRepository.searchProducts(nom, couleur, prixMin, prixMax);
    }
}
