Where to Get This Data (Free Sources)
NASA POWER — has global solar radiation data including DLI or the values to calculate it. Free API, works for any coordinate in Finland.

API: https://power.larc.nasa.gov/api/

Plant DLI requirements — This is the harder part. Most databases don't list DLI directly. But:
Workaround for v1.0:

USDA and European plant databases list "full sun / part shade / full shade"
Academic literature has measured DLI for common crops and ornamentals
You can manually collect DLI for 20 common plants to start

Actual sources:

Tomato: 20-30 mol/m²/day (well documented)
Lettuce: 12-17 mol/m²/day
Basil: 12-18 mol/m²/day
Hostas (shade plant): 4-10 mol/m²/day

I can help you find documented DLI values for specific plants you care about.

1. Plant Database (JSON/SQLite)
   - plant_id, name, dli_min, dli_optimal, dli_max

2. Location Climate Data (cached from NASA POWER)
   - location_id, month, avg_dli

3. Calculator
   - Input: plant_id, location_id, month
   - Output: hours of sun needed per day

4. CLI or simple web interface
   - "Show me light requirements for tomatoes in Helsinki"

   DLI is measured per day. If you know:

Plant needs 25 mol/m²/day (optimal)
Helsinki in June averages 35 mol/m²/day max DLI

Then in direct sun, you need: 25/35 × 24 hours = 17 hours (but June has 19 hours of daylight, so "full sun all day" works)
In Helsinki in April with max 20 mol/m²/day:

25/20 × 24 = 30 hours (impossible! Plant needs supplemental light or greenhouse)

This is immediately useful information a Finnish gardener can't get anywhere else.

Solanum lycopersicum (tomato)
Lactuca sativa (lettuce)
Cucumis sativus (cucumber)
Capsicum annuum (bell pepper)
Beta vulgaris (beet)
Daucus carota (carrot)
Fragaria × ananassa (strawberry)
Ocimum basilicum (basil)
Petroselinum crispum (parsley)
Allium cepa (onion)

USDA data limitations:

Hardiness zones are North American centric
Light requirements assume North American sun angles
Not directly applicable to Finland

What you still use from USDA:

Plant physiological data (DLI needs, temperature tolerances) - these are species-specific and don't change with geography
A tomato needs 20-30 mol/m²/day whether it's in Texas or Turku

What you get from other sources:

NASA POWER - Finnish solar radiation data
FMI (Finnish Meteorological Institute) - Finnish climate data (also free)
European plant databases - may have better European context

The calculation layer is what adapts USDA plant data to Finnish conditions.
# light calcs
What You Need

✅ Daily Light Integral (DLI) in mol/m²/day
✅ Minimum light hours at specific intensity
✅ UV tolerance ranges
You need:

Light intensity (not just duration)
Photoperiod sensitivity (some plants bolt with >14 hour days)
UV stress thresholds
Optimal vs tolerable ranges

Option 1: Infer from Qualitative Data
USDA says "full sun" 
→ Research: "full sun" = 6+ hours direct sunlight
→ Research: Direct sunlight = ~2000 μmol/m²/s
→ Calculate DLI: 6 hours × 2000 × 3.6 = ~43 mol/m²/day
Option 2: Use Species Distribution Modeling

Get occurrence data from GBIF (where plant grows)
Get solar radiation data for those locations (NASA POWER)
Infer light tolerance from actual growing conditions

Option 3: Academic Papers (Manual Collection)

Search for specific plants on Google Scholar
Many papers publish DLI requirements
Time-consuming but accurate

Option 4: Horticulture Databases (Some Data)

Plants For A Future (PFAF) - has some light data
Missouri Botanical Garden - partial data
RHS (Royal Horticultural Society) - UK plants