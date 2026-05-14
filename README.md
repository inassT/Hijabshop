# HijabShop - Plateforme E-commerce Premium (Projet JEE)

## Contexte du Projet
Ce projet a été réalisé dans le cadre du **Contrôle JEE 2025-2026 (Semestre 2 - 4DDSIR)**. 
Il s'agit d'une plateforme e-commerce complète dédiée à la vente de hijabs, intégrant un système intelligent de recommandation colorimétrique.

---

## 🚀 Technologies Utilisées

### Backend (Spring Boot)
*   **Spring Boot 3.x** : Socle de l'application.
*   **Spring Web (MVC)** : Gestion des API REST.
*   **Spring Data JPA** : Persistance des données et abstraction CRUD.
*   **Spring Security** : Sécurisation par JWT (Stateless), gestion des rôles (USER, ADMIN).
*   **H2 Database** : Base de données relationnelle en mémoire (ou MySQL selon config).
*   **Lombok** : Réduction du code boilerplate (getters/setters).

### Frontend (React)
*   **React.js** : Interface utilisateur moderne et réactive.
*   **Tailwind CSS** : Design premium et responsive.
*   **Framer Motion** : Animations fluides et micro-interactions.
*   **Lucide React** : Système d'icônes.

---

## 🏛️ Architecture en Couches
L'application respecte une architecture J2EE standard pour assurer la séparation des responsabilités :
1.  **Couche Modèle (Entity)** : Définition des objets métier avec JPA.
2.  **Couche Repository** : Interface avec la base de données via Spring Data JPA.
3.  **Couche Service** : Logique métier et orchestration des données.
4.  **Couche Contrôleur (REST)** : Exposition des points d'entrée API.

---

## 📝 Fonctionnalités & Comparaison "Spring vs Classic"
*Conformément aux exigences du projet, le code source contient des commentaires détaillés comparant l'approche Spring à l'approche traditionnelle (Servlets, JDBC, JSP).*

### 1. Authentification & Sécurité
*   **Spring Security** : Utilisation d'une chaîne de filtres (`SecurityFilterChain`) et JWT.
*   **Comparaison** : Explication de l'alternative via des `Servlet Filters` manuels et une gestion de session via `HttpSession`.
*   *Voir : `SecurityConfig.java`*

### 2. Gestion des Produits (CRUD)
*   **Spring Data JPA** : Utilisation de `JpaRepository` pour automatiser les requêtes.
*   **Comparaison** : Analyse de l'approche `JDBC` classique avec construction manuelle des requêtes SQL et gestion des `ResultSet`.
*   *Voir : `ProductRepository.java`*

### 3. Recherche et Filtrage
*   **Spring Data** : Utilisation de requêtes dérivées et `@Query` (JPQL).
*   **Comparaison** : Analyse de la construction dynamique de chaînes SQL en Java sans ORM.
*   *Voir : `ProductRepository.java`*

### 4. Interactions Utilisateur (Avis & Favoris)
*   **JPA Relations** : Utilisation de `@ManyToOne` et `@ManyToMany`.
*   **Comparaison** : Gestion manuelle des tables de jointure et des contraintes d'intégrité en SQL.
*   *Voir : `Review.java`, `User.java`*

### 5. Panier et Commandes
*   **Spring Architecture** : Services dédiés et persistance automatique.
*   **Comparaison** : Gestion du panier via la session `Servlet` (In-memory) vs stockage BDD.

---

## 🛠️ Installation et Lancement

### Backend
1. Naviguer dans le dossier `backend`.
2. Lancer la commande : `./gradlew bootRun` (ou `gradlew.bat` sur Windows).
3. L'API est disponible sur `http://localhost:8080`.

### Frontend
1. Naviguer dans le dossier `frontend`.
2. Lancer la commande : `npm install` puis `npm run dev`.
3. L'interface est disponible sur `http://localhost:5173`.

---

## 👤 Auteur
**[TEMMAR INASS/ EL JABRI LAMIAE ]** - 4DDSIR 2025-2026
