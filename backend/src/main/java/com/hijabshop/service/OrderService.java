package com.hijabshop.service;

import com.hijabshop.model.Order;
import com.hijabshop.model.OrderItem;
import com.hijabshop.model.OrderStatus;
import com.hijabshop.model.Product;
import com.hijabshop.model.Cart;
import com.hijabshop.model.CartItem;
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
    private final CartService cartService;

    @Transactional
    public Order checkout(String email) {
        Cart cart = cartService.getCartByUser(email);
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Le panier est vide.");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setDate(LocalDateTime.now());
        order.setStatut(OrderStatus.EN_ATTENTE);
        order.setTotal(cart.getTotalPrice());

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            
            // Vérifier le stock
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Stock insuffisant pour: " + product.getNom());
            }

            // Décrémenter le stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantite(cartItem.getQuantity());
            orderItem.setPrix(cartItem.getPrice());
            order.getItems().add(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        
        // Vider le panier après succès
        cartService.clearCart(email);
        
        return savedOrder;
    }

    @Transactional
    public Order createOrder(Order order) {
        // Cette méthode peut rester pour des usages admin ou manuels
        order.setDate(LocalDateTime.now());
        order.setStatut(OrderStatus.EN_ATTENTE);

        if (order.getItems() != null) {
            for (var item : order.getItems()) {
                item.setOrder(order);
                Product product = productRepository.findById(item.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Produit introuvable"));
                product.setStock(product.getStock() - item.getQuantite());
                productRepository.save(product);
            }
        }

        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée"));
        order.setStatut(status);
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


