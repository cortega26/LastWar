---
layout: single
title: "Calculators"
permalink: /calculators/
---

{% for calc in site.calculators %}
{% unless calc.hidden %}
<div class="archive__item">
  <h2 class="archive__item-title no_toc"><a href="{{ calc.url | relative_url }}">{{ calc.title }}</a></h2>
</div>
{% endunless %}
{% endfor %}
