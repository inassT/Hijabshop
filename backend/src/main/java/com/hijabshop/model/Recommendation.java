package com.hijabshop.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Recommendation {

    private String teint;
    private String sousTon;
    private List<String> couleursRecommandees;
}
