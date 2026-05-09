package com.hijabshop.service;

import com.hijabshop.model.Recommendation;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class RecommendationService {

    public Recommendation getRecommendations(String teint, String sousTon) {
        List<String> couleurs;

        if (teint == null || sousTon == null) {
            couleurs = Collections.emptyList();
        } else if (teint.equalsIgnoreCase("clair") && sousTon.equalsIgnoreCase("froid")) {
            couleurs = Arrays.asList("bleu", "rose", "gris");
        } else if (teint.equalsIgnoreCase("foncé") && sousTon.equalsIgnoreCase("chaud")) {
            couleurs = Arrays.asList("beige", "doré", "orange");
        } else {
            // Logique par défaut ou autres combinaisons
            couleurs = Arrays.asList("noir", "blanc", "kaki");
        }

        return new Recommendation(teint, sousTon, couleurs);
    }
}
