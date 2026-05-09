package com.hijabshop.controller;

import com.hijabshop.model.Recommendation;
import com.hijabshop.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping
    public List<String> getRecommendations(@RequestBody Recommendation request) {
        Recommendation result = recommendationService.getRecommendations(request.getTeint(), request.getSousTon());
        return result.getCouleursRecommandees();
    }
}
