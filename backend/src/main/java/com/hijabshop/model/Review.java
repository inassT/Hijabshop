package com.hijabshop.model;

/**
 * COMPARAISON GESTION DES RELATIONS (JPA vs SQL MANUEL) :
 * 
 * 1. Relations entre tables :
 *    - SANS SPRING (SQL/JDBC) : Il faudrait gérer manuellement les clés étrangères 
 *      dans les requêtes SQL (JOIN) et transformer le résultat (ResultSet) 
 *      en objets Java complexes. Pour un "Commentaire", il faudrait faire un 
 *      "SELECT ... FROM reviews JOIN users ON ..."
 *    - AVEC SPRING JPA : On utilise les annotations @ManyToOne et @JoinColumn. 
 *      JPA s'occupe de charger l'utilisateur et le produit associés automatiquement.
 * 
 * 2. Mapping Objet-Relationnel (ORM) :
 *    - SANS SPRING : Il faudrait mapper chaque colonne du ResultSet vers un champ 
 *      de l'objet Java ligne par ligne.
 *    - AVEC SPRING : L'annotation @Entity transforme automatiquement cette classe 
 *      en table de base de données, simplifiant énormément le développement.
 */

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Product product;

    @Column(nullable = false)
    private Integer note; // e.g. 1 to 5

    @Column(columnDefinition = "TEXT")
    private String commentaire;
}
