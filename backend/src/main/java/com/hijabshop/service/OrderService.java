package com.hijabshop.service;

import com.hijabshop.model.Order;
import com.hijabshop.model.Product;
import com.hijabshop.repository.OrderRepository;
import com.hijabshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Order createOrder(Order order) {
        order.setDate(LocalDateTime.now());
        order.setStatut("EN_ATTENTE");

        // Vérifier le stock et lier chaque item à la commande
        if (order.getItems() != null) {
            for (var item : order.getItems()) {
                item.setOrder(order);

                // Vérification du stock (PRIORITÉ 7)
                Product product = productRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Produit introuvable: " + item.getProduct().getId()));

                if (product.getStock() < item.getQuantite()) {
                    throw new RuntimeException("Stock insuffisant pour: " + product.getNom()
                            + " (disponible: " + product.getStock() + ", demandé: " + item.getQuantite() + ")");
                }

                // Décrémenter le stock
                product.setStock(product.getStock() - item.getQuantite());
                productRepository.save(product);
            }
        }

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}

