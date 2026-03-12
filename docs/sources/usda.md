## Source data explanation

# 🌿 USDA Plant Characteristics

This document explains the USDA Plant Characteristics API fields using a
Trefle‑inspired structure: grouped attributes, readable tables, and simple
visual scales to make qualitative USDA data easier to interpret.

This documentation was done using co-pilot and has not been yet checked for accuracy. 
---

# 🌱 1. Morphology & Physiology

## **Growth Habit & Structure**

| Field | Description |
|-------|-------------|
| **Growth Form** | Structural form (tree, shrub, forb, grass, vine). |
| **Shape & Orientation** | Crown shape (rounded, columnar, spreading). |
| **Height at 20 Years** | Expected height after 20 years (ft). |
| **Mature Height** | Typical maximum height (ft). |
| **Lifespan** | Expected life duration. |

### **Lifespan Scale**
```
Short   ▓▓░░░░░░░░░░░░░░░░░░░ Long
```

---

## **Foliage & Flowers**

| Field | Description |
|-------|-------------|
| **Foliage Color** | Leaf color during growing season. |
| **Foliage Texture** | Fine / Medium / Coarse. |
| **Foliage Porosity (Summer/Winter)** | Density of foliage. |
| **Flower Color** | Primary flower color. |
| **Flower Conspicuous** | Whether flowers are visually prominent. |

### **Foliage Porosity Scale**
```
Low ▓▓░░░░░░░░░░░░░░░░░░ High
```

---

## **Fruit & Seeds**

| Field | Description |
|-------|-------------|
| **Fruit/Seed Color** | Color of fruits or seeds. |
| **Fruit/Seed Conspicuous** | Whether fruits/seeds are visually prominent. |
| **Fruit/Seed Persistence** | Whether seeds remain on plant after maturity. |

---

## **Physiological Traits**

| Field | Description |
|-------|-------------|
| **C:N Ratio** | Carbon-to-nitrogen ratio (Low/Med/High). |
| **Nitrogen Fixation** | Ability to fix atmospheric nitrogen. |
| **Resprout Ability** | Ability to regrow after damage. |
| **Coppice Potential** | Ability to regrow after being cut to base. |
| **Fire Resistant** | Resistance to fire damage. |
| **Known Allelopath** | Whether plant inhibits others chemically. |
| **Toxicity** | Toxicity to humans/animals. |

### **Nitrogen Fixation Scale**
```
None ░░░░░░░░░░░░░░░░░░ High ▓▓▓▓▓▓▓▓▓▓▓▓
```

---

# 🌾 2. Growth Requirements

## **Soil Requirements**

| Field | Description |
|-------|-------------|
| **Adapted to Coarse Soil** | Sandy soils. |
| **Adapted to Medium Soil** | Loamy soils. |
| **Adapted to Fine Soil** | Clay soils. |
| **pH Minimum / Maximum** | Soil pH range tolerated. |
| **CaCO₃ Tolerance** | Tolerance to alkaline/calcareous soils. |
| **Salinity Tolerance** | Tolerance to saline soils. |
| **Root Depth Minimum** | Minimum rooting depth (inches). |

### **Soil Texture Key**
```
Coarse = sand
Medium = loam
Fine   = clay
```

---

## **Climate Requirements**

| Field | Description |
|-------|-------------|
| **Drought Tolerance** | Ability to withstand dry conditions. |
| **Moisture Use** | Water needs. |
| **Precipitation Min/Max** | Annual precipitation range (inches). |
| **Temperature Minimum** | Minimum air temperature tolerated (°F). |
| **Frost-Free Days Minimum** | Minimum frost-free days required. |

### **Temperature Minimum Notes**
- USDA uses **air temperature**, not soil temperature.  
- Derived from **hardiness zone survival data** and freeze studies.

### **Drought Tolerance Scale**
```
Low ░░░░░░░░░░░░░░ High ▓▓▓▓▓▓▓▓▓▓▓▓
```

---

## **Light Requirements**

| Field | Description |
|-------|-------------|
| **Shade Tolerance** | Ability to grow in shade. |

### **Shade Tolerance Scale (USDA Forestry Standard)**
```
Intolerant     ▓░░░░░░░░░░░░░░░░░░
Intermediate   ▓▓▓▓▓░░░░░░░░░░░░░
Tolerant       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

**How USDA measures shade tolerance:**  
- Based on forestry research (Baker 1949, Burns & Honkala).  
- Determined by seedling survival and growth under canopy shade.  
- Not a numeric measurement — an expert‑derived ecological rating.

---

## **Fire & Flood Tolerance**

| Field | Description |
|-------|-------------|
| **Fire Tolerance** | Ability to survive fire. |
| **Anaerobic Tolerance** | Tolerance to waterlogged, low‑oxygen soils. |

### **Anaerobic Tolerance Scale**
```
None ░░░░░░░░░░░░░░ High ▓▓▓▓▓▓▓▓▓▓▓▓
```

---

# 🌼 3. Reproduction

## **Flowering & Fruiting**

| Field | Description |
|-------|-------------|
| **Bloom Period** | Flowering season. |
| **Fruit/Seed Period Begin/End** | Timing of fruit/seed production. |
| **Fruit/Seed Abundance** | Quantity produced. |

---

## **Seed Traits**

| Field | Description |
|-------|-------------|
| **Seed per Pound** | Number of seeds per pound. |
| **Seed Spread Rate** | Speed of seed dispersal. |
| **Seedling Vigor** | Strength and growth rate of seedlings. |
| **Cold Stratification Required** | Whether seeds need cold treatment. |

### **Seedling Vigor Scale**
```
Low ░░░░░░░░░░░░░░ High ▓▓▓▓▓▓▓▓▓▓▓▓
```

---

## **Propagation Methods**

| Field | Description |
|-------|-------------|
| **Propagated by Bare Root** | Yes/No. |
| **Propagated by Bulb** | Yes/No. |
| **Propagated by Container** | Yes/No. |
| **Propagated by Seed** | Yes/No. |
| **Propagated by Sod** | Yes/No. |
| **Propagated by Sprig** | Yes/No. |
| **Propagated by Tuber** | Yes/No. |

---

# 🪵 4. Suitability & Uses

| Field | Description |
|-------|-------------|
| **Berry/Nut/Seed Product** | Edible or useful seeds/nuts. |
| **Christmas Tree Product** | Suitability as Christmas tree. |
| **Fodder Product** | Use as animal feed. |
| **Fuelwood Product** | Suitability for firewood. |
| **Lumber Product** | Suitability for lumber. |
| **Naval Store Product** | Resin/turpentine production. |
| **Nursery Stock Product** | Suitability for nursery trade. |
| **Palatable Browse Animal** | Palatability to browsing animals. |
| **Palatable Human** | Edibility for humans. |
| **Post Product** | Suitability for fence posts. |
| **Protein Potential** | Protein content potential. |
| **Pulpwood Product** | Suitability for pulp/paper. |
| **Veneer Product** | Suitability for veneer. |

---

# 📘 Notes on USDA Data Quality

USDA traits are **not** always numeric measurements. Many are:

- expert‑derived ecological ratings  
- categorical horticultural classifications  
- forestry tolerance scales  
- literature‑based summaries  

This is why fields like *shade tolerance* or *drought tolerance* are qualitative.

---

# ✔ Summary

This document provides:

- Trefle‑style grouping  
- Clean tables  
- Visual scales  
- Clarified meanings for vague USDA fields  
- Copy‑paste‑ready Markdown  

