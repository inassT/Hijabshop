package com.hijabshop.repository;

/**
 * COMPARAISON CRUD & RECHERCHE (JDBC vs SPRING DATA JPA) :
 * 
 * 1. Implémentation du CRUD :
 *    - SANS SPRING (JDBC) : Il faudrait écrire manuellement des classes DAO avec 
 *      des méthodes comme save(), update(), delete() utilisant Connection, 
 *      PreparedStatement et ResultSet. Beaucoup de code répétitif (Boilerplate).
 *    - AVEC SPRING DATA JPA : Il suffit d'étendre JpaRepository<Product, Long>. 
 *      Spring génère automatiquement l'implémentation des méthodes standard.
 * 
 * 2. Recherche et Filtrage :
 *    - SANS SPRING : Il faudrait construire dynamiquement une chaîne SQL complexe 
 *      dans le code Java : "SELECT * FROM products WHERE 1=1" + (nom != null ? " AND nom LIKE ..." : "").
 *    - AVEC SPRING : On utilise @Query avec du JPQL (Java Persistence Query Language) 
 *      ou simplement des "Query Methods" comme findByNomContaining().
 * 
 * 3. Gestion des Données : Spring gère l'EntityManager et les transactions 
 *    automatiquement, évitant les fuites de connexion courantes en JDBC classique.
 */

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

