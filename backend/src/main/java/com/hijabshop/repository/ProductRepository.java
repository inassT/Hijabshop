package com.hijabshop.repository;

import com.hijabshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
           "(:nom IS NULL OR LOWER(p.nom) LIKE LOWER(CONCAT('%', :nom, '%'))) AND " +
           "(:couleur IS NULL OR LOWER(p.couleur) = LOWER(:couleur)) AND " +
           "(:prixMin IS NULL OR p.prix >= :prixMin) AND " +
           "(:prixMax IS NULL OR p.prix <= :prixMax)")
    List<Product> searchProducts(
            @Param("nom") String nom,
            @Param("couleur") String couleur,
            @Param("prixMin") Double prixMin,
            @Param("prixMax") Double prixMax
    );
}

