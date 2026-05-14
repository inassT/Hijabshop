# 📘 Fiche de Révision : Spring Boot vs JEE Classique
**Projet : HijabShop | Contrôle JEE 2025-2026**

Cette fiche résume les différences fondamentales entre l'approche traditionnelle (sans Spring) et l'approche moderne avec Spring Boot, telle qu'implémentée dans votre projet.

---

## 1. Architecture Web : Servlets vs Spring MVC
| Aspect | Approche Classique (Sans Spring) | Approche Spring MVC |
| :--- | :--- | :--- |
| **Mapping** | Déclaré dans `web.xml` ou via `@WebFilter`. | Annotations simples `@RestController`, `@GetMapping`. |
| **Surcharge** | Obligation d'étendre `HttpServlet` et surcharger `doGet`, `doPost`. | Méthodes Java simples avec annotations de mapping. |
| **Données** | Extraction manuelle via `request.getParameter()`. | Injection automatique via `@RequestParam`, `@PathVariable`. |
| **JSON** | Conversion manuelle via Jackson ou GSON (`objectMapper.readValue`). | Conversion automatique via l'annotation `@RequestBody`. |
| **Réponse** | Utilisation de `response.getWriter().write()`. | Retour direct d'objets ou `ResponseEntity<T>`. |

---

## 2. Accès aux Données : JDBC vs Spring Data JPA
| Aspect | Approche Classique (JDBC) | Approche Spring Data JPA |
| :--- | :--- | :--- |
| **Boilerplate** | Gestion manuelle des `Connection`, `Statement`, `ResultSet`. | Abstraction totale. Spring gère le cycle de vie. |
| **CRUD** | Écriture manuelle de chaque requête SQL (INSERT, UPDATE...). | Automatique en étendant `JpaRepository<T, ID>`. |
| **Requêtes** | Concaténation de chaînes SQL complexes (risque d'erreur). | Query Methods (ex: `findByNom`) ou `@Query` (JPQL). |
| **Exceptions** | Gestion lourde des `SQLException` (Checked exceptions). | Conversion automatique en `DataAccessException` (Runtime). |

---

## 3. Sécurité : Filtres Manuels vs Spring Security
| Aspect | Approche Classique (Sans Spring Security) | Approche Spring Security |
| :--- | :--- | :--- |
| **Filtres** | Un `Servlet Filter` manuel par besoin (Auth, Log, etc.). | Une `FilterChain` centralisée et configurable. |
| **Session** | `request.getSession()` : gestion manuelle complexe. | Centralisée. Support natif du **Stateless (JWT)**. |
| **Rôles** | Vérification manuelle : `if(user.hasRole(...))`. | Déclaratif : `.hasRole("ADMIN")` ou `@PreAuthorize`. |
| **Protection** | Protection CSRF, XSS, Fixation de session à coder. | Protections activées par défaut. |

---

## 4. Relations : SQL Joins vs JPA Annotations
| Aspect | Approche Classique (SQL Manuel) | Approche JPA/Hibernate |
| :--- | :--- | :--- |
| **Liaisons** | Utilisation de clés étrangères et de `JOIN` SQL. | Annotations `@ManyToOne`, `@OneToMany`, `@ManyToMany`. |
| **Mapping** | Mapper chaque colonne du `ResultSet` vers l'objet Java. | Mapping automatique via l'annotation `@Entity`. |
| **Chargement** | Toujours charger toutes les données ou faire plusieurs SQL. | Gestion du `Lazy Loading` (charger uniquement si besoin). |

---

## 5. Le Cœur de Spring : Inversion de Contrôle (IoC)
*   **Sans Spring** : Vous devez créer vos objets vous-même (`Service s = new ServiceImpl()`). Si le service change, vous devez modifier partout.
*   **Avec Spring** : Vous utilisez l'**Injection de Dépendances** (`@Autowired` ou constructeur). Spring gère la création et l'injection des objets. 
    *   *Avantage* : Code plus flexible, plus facile à tester et plus modulaire.

---

## 💡 Mots-clés à retenir pour l'oral :
1.  **Boilerplate Code** : Code répétitif supprimé par Spring.
2.  **Couplage Faible** : Grâce à l'Injection de Dépendances.
3.  **Abstraction** : Spring Data JPA cache la complexité de SQL.
4.  **Aspect-Oriented Programming (AOP)** : Spring gère la sécurité et les transactions "autour" de votre code.
