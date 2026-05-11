-- ============================================================
-- HijabShop — Données initiales
-- Exécuté au démarrage si spring.sql.init.mode=always
-- ============================================================

-- Supprimer dans l'ordre des dépendances (Désactivé pour garder les données)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE order_items;
-- TRUNCATE TABLE orders;
-- TRUNCATE TABLE reviews;
-- TRUNCATE TABLE products;
-- TRUNCATE TABLE users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- UTILISATEURS (mot de passe = "admin123" hashé en BCrypt)
-- ============================================================
INSERT INTO users (nom, email, password, role) VALUES
('Admin Global', 'ADMIN@GMAIL.COM', '$2b$10$z53GbMm/0Pm3vJDUBQ1ECeBsFYlhDZiTnTwi0NXIaW6NDJdpsG4mu', 'ADMIN'),
('Admin HijabShop', 'admin@hijabshop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lFhS', 'ADMIN'),
('Fatima Zahra', 'user@hijabshop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lFhS', 'USER');

-- ============================================================
-- PRODUITS (10 hijabs)
-- ============================================================
INSERT INTO products (nom, description, prix, couleur, image, stock) VALUES
(
  'Hijab Mousseline Ivoire',
  'Un hijab en mousseline légère et fluide, parfait pour les tenues de jour. Sa texture douce et son tombé élégant en font une pièce incontournable.',
  24.99,
  'Blanc',
  'https://lamis-boutique.fr/10024-large_default/hijab-soie-de-medine.jpg',
  50
),
(
  'Hijab Jersey Bleu Royal',
  'Hijab en jersey extensible très confortable. Le bleu royal sublime les peaux claires et mate. Idéal pour le quotidien et les occasions formelles.',
  19.99,
  'Bleu',
  'http://barakahshops.com/cdn/shop/files/4C72399A-FC2D-4C6C-901E-13887785778D.jpg?v=1703968347',
  40
),
(
  'Hijab Satin Rose Nude',
  'Un hijab en satin avec un fini brillant et luxueux. Le rose nude est une couleur universelle qui convient à tous les teints.',
  29.99,
  'Rose',
  'https://www.cave-london.com/cdn/shop/products/powder-pink-grain-satin-hijab-24756817297587.jpg?v=1756911293&width=1080',
  35
),
(
  'Hijab Crêpe Vert Émeraude',
  'Le hijab en crêpe est la solution anti-froissage par excellence. Ce vert émeraude profond apporte une touche de couleur sophistiquée à vos tenues.',
  22.99,
  'Vert',
  'http://www.chally.ma/cdn/shop/products/DSC5856_1200x1200.jpg?v=1665252567',
  45
),
(
  'Hijab Pashmina Beige Caramel',
  'Grand hijab en pashmina chaleureux et élégant. Ce beige caramel chaud est la couleur phare de la saison, adaptée aux sous-tons chauds.',
  34.99,
  'Beige',
  'https://www.jilbab-femme.com/654-product_zoom/hijab-soie-de-medine-beige-agate.jpg',
  30
),
(
  'Hijab Noir Classique',
  'Le hijab noir indémodable en tissu jersey premium. Une base essentielle dans tout vestiaire, facile à porter et à assortir avec n''importe quelle tenue.',
  17.99,
  'Noir',
  'https://www.cave-london.com/cdn/shop/products/jet-black-soft-satin-hijab-24756910620851.jpg?v=1756912328&width=1080',
  60
),
(
  'Hijab Mousseline Lavande',
  'Une couleur lavande apaisante dans un tissu mousseline aérien. Idéal pour les soirées et les mariages, ce hijab donne un effet vapoureux très romantique.',
  26.99,
  'Violet',
  'https://www.my-jilbab.com/3138-large_default/hijab-mousseline-opaque-lila.jpg',
  25
),
(
  'Hijab Jersey Gris Perle',
  'Le gris perle est la couleur neutre élégante par excellence. Ce hijab en jersey stretch s''adapte parfaitement à la morphologie et reste en place toute la journée.',
  19.99,
  'Gris',
  'https://alliyah-boutique.com/2488-home_default/hijab-en-jersey.jpg',
  55
),
(
  'Hijab Brodé Blanc Cassé',
  'Un hijab exceptionnel avec des broderies florales délicates sur les bords. En blanc cassé, il est parfait pour les cérémonies et les occasions spéciales.',
  44.99,
  'Blanc',
  'https://qalamdress.com/cdn/shop/products/hijab-mousseline-blanc-casse-mariee_1_2000x.jpg?v=1626265647',
  20
),
(
  'Hijab Coton Terracotta',
  'Le terracotta est LA tendance de la saison. Ce hijab en coton respirant est parfait pour les journées chaudes. Confortable, naturel et stylé.',
  21.99,
  'Orange',
  'https://mayasquare.com/wp-content/uploads/2022/11/Hijab-Jersey-Cotton-Terracotta-1.jpg',
  38
);
