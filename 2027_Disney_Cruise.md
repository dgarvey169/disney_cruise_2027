# 🚢 Disney Destiny: 7-Night Western Caribbean Cruise (2027)

**Reservation #**: `44830495`  
**Ship**: Disney Destiny  
**Dates**: July 31, 2027 – August 7, 2027  
**Departure Port**: Fort Lauderdale, FL (Port Everglades)  
**Stateroom**: 9100 (Category 04B – Deluxe Family Oceanview Stateroom with Verandah, Deck 9 Midship)  
**Guests**: Katie Ann Garvey, Andrew Ryan Garvey, Riley Regina Garvey, Amelia Lee Garvey (Party of 4)  

---

### Table of Contents
1. [Reservation & Party Details](#reservation-details)
2. [Key Booking Milestones & Countdown](#key-milestones)
3. [Complete Daily Itinerary & Port Schedule](#daily-itinerary)
4. [Dining & Evening Schedule](#dining-schedule)
5. [Excursion & Port Adventure Planning](#excursions)
6. [Budget & Expense Tracker](#budget-tracker)
7. [Preparation & Document Checklist](#checklist)

## 0. Source Itinerary Documents (PDFs) <a id="source-docs"></a>

The source PDF confirmation documents are stored locally in the [`Itineraries/`](Itineraries/) directory:
- [My Reservations - Disney Cruise Line.pdf](Itineraries/My%20Reservations%20-%20Disney%20Cruise%20Line.pdf)
- [My Reservations - Disney Cruise Line_Daily_Itinerary.pdf](Itineraries/My%20Reservations%20-%20Disney%20Cruise%20Line_Daily_Itinerary.pdf)


```python
import os
import subprocess

pdf_dir = "Itineraries"
pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith(".pdf")]

print(f"Found {len(pdf_files)} PDF source documents in ./{pdf_dir}:")
for f in sorted(pdf_files):
    size_mb = os.path.getsize(os.path.join(pdf_dir, f)) / (1024 * 1024)
    print(f" - {f} ({size_mb:.2f} MB)")
```

    Found 2 PDF source documents in ./Itineraries:
     - My Reservations - Disney Cruise Line.pdf (13.35 MB)
     - My Reservations - Disney Cruise Line_Daily_Itinerary.pdf (11.34 MB)


## 1. Reservation & Party Details <a id="reservation-details"></a>


```python
import pandas as pd
from datetime import datetime, date

RESERVATION = {
    "reservation_number": "44830495",
    "ship": "Disney Destiny",
    "itinerary_name": "7-Night Western Caribbean Cruise from Fort Lauderdale",
    "sail_date_start": "2027-07-31",
    "sail_date_end": "2027-08-07",
    "departure_port": "Fort Lauderdale, FL",
    "stateroom_number": "9100",
    "stateroom_category": "04B (Deluxe Family Oceanview Stateroom with Verandah)",
    "stateroom_deck": 9,
    "stateroom_location": "Midship",
    "main_dining_time": "5:45 PM (Main Seating)",
    "show_time": "8:15 PM",
    "vacation_protection": "Added (All 4 Guests)",
    "party_size": 4
}

guests = [
    {"Name": "KATIE ANN GARVEY", "Role": "Primary Guest", "Stateroom": "9100", "Vacation Protection": "Added"},
    {"Name": "ANDREW RYAN GARVEY", "Role": "Guest", "Stateroom": "9100", "Vacation Protection": "Added"},
    {"Name": "RILEY REGINA GARVEY", "Role": "Guest", "Stateroom": "9100", "Vacation Protection": "Added"},
    {"Name": "AMELIA LEE GARVEY", "Role": "Guest", "Stateroom": "9100", "Vacation Protection": "Added"}
]

df_guests = pd.DataFrame(guests)
print(f"🚢 {RESERVATION['ship']} | Reservation #{RESERVATION['reservation_number']}")
print(f"🛏️ Stateroom: {RESERVATION['stateroom_number']} (Deck {RESERVATION['stateroom_deck']}, {RESERVATION['stateroom_location']})")
print(f"🍽️ Dining: {RESERVATION['main_dining_time']} | 🎭 Show: {RESERVATION['show_time']}")
display(df_guests)
```

    🚢 Disney Destiny | Reservation #44830495
    🛏️ Stateroom: 9100 (Deck 9, Midship)
    🍽️ Dining: 5:45 PM (Main Seating) | 🎭 Show: 8:15 PM



<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Name</th>
      <th>Role</th>
      <th>Stateroom</th>
      <th>Vacation Protection</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>KATIE ANN GARVEY</td>
      <td>Primary Guest</td>
      <td>9100</td>
      <td>Added</td>
    </tr>
    <tr>
      <th>1</th>
      <td>ANDREW RYAN GARVEY</td>
      <td>Guest</td>
      <td>9100</td>
      <td>Added</td>
    </tr>
    <tr>
      <th>2</th>
      <td>RILEY REGINA GARVEY</td>
      <td>Guest</td>
      <td>9100</td>
      <td>Added</td>
    </tr>
    <tr>
      <th>3</th>
      <td>AMELIA LEE GARVEY</td>
      <td>Guest</td>
      <td>9100</td>
      <td>Added</td>
    </tr>
  </tbody>
</table>
</div>


## 2. Key Booking Milestones & Countdown <a id="key-milestones"></a>


```python
# Milestones based on official reservation confirmation
milestones = [
    {"Milestone": "Activity & Excursion Booking Window Opens", "Date": "2027-05-02", "Details": "Book Port Adventures, Palo/Enchanté adult dining, Bibbidi Bobbidi Boutique (Must be paid in full)"},
    {"Milestone": "Online Check-In & Port Arrival Time Selection", "Date": "2027-06-28", "Details": "Upload passport scans, security photos, credit card for onboard folio, and select PAT"},
    {"Milestone": "Embarkation Day (All Aboard 4:00 PM)", "Date": "2027-07-31", "Details": "Arrive at Port Everglades, Fort Lauderdale; Ship departs 5:00 PM"},
    {"Milestone": "Debarkation Day", "Date": "2027-08-07", "Details": "Debarkation begins 8:00 AM at Fort Lauderdale, FL"}
]

df_milestones = pd.DataFrame(milestones)
df_milestones["Date"] = pd.to_datetime(df_milestones["Date"]).dt.date

today = date.today()
df_milestones["Days_Until"] = df_milestones["Date"].apply(lambda d: (d - today).days)
display(df_milestones)
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Milestone</th>
      <th>Date</th>
      <th>Details</th>
      <th>Days_Until</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Activity &amp; Excursion Booking Window Opens</td>
      <td>2027-05-02</td>
      <td>Book Port Adventures, Palo/Enchanté adult dini...</td>
      <td>240</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Online Check-In &amp; Port Arrival Time Selection</td>
      <td>2027-06-28</td>
      <td>Upload passport scans, security photos, credit...</td>
      <td>297</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Embarkation Day (All Aboard 4:00 PM)</td>
      <td>2027-07-31</td>
      <td>Arrive at Port Everglades, Fort Lauderdale; Sh...</td>
      <td>330</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Debarkation Day</td>
      <td>2027-08-07</td>
      <td>Debarkation begins 8:00 AM at Fort Lauderdale, FL</td>
      <td>337</td>
    </tr>
  </tbody>
</table>
</div>


## 3. Complete Daily Itinerary & Port Schedule <a id="daily-itinerary"></a>


```python
daily_itinerary = [
    {
        "Day": 1,
        "Date": "2027-07-31 (Sat)",
        "Port / Location": "Fort Lauderdale, FL",
        "All_Ashore": "--",
        "All_Aboard": "4:00 PM",
        "Departure": "5:00 PM",
        "Highlights": "Embarkation, Sail Away Deck Party, Mandatory Safety Drill"
    },
    {
        "Day": 2,
        "Date": "2027-08-01 (Sun)",
        "Port / Location": "At Sea",
        "All_Ashore": "--",
        "All_Aboard": "--",
        "Departure": "--",
        "Highlights": "Sea Day fun: Hero Zone, AquaMouse, Pools, Disney Broadway-style show"
    },
    {
        "Day": 3,
        "Date": "2027-08-02 (Mon)",
        "Port / Location": "George Town, Grand Cayman (Tender Port)",
        "All_Ashore": "8:00 AM (Tendering)",
        "All_Aboard": "5:00 PM",
        "Departure": "5:30 PM",
        "Highlights": "Stingray City, Seven Mile Beach, Cayman Turtle Centre"
    },
    {
        "Day": 4,
        "Date": "2027-08-03 (Tue)",
        "Port / Location": "Falmouth, Jamaica",
        "All_Ashore": "7:30 AM",
        "All_Aboard": "5:00 PM",
        "Departure": "5:30 PM",
        "Highlights": "Dunn\x27s River Falls, River Tubing, Jamaican Culinary Adventures"
    },
    {
        "Day": 5,
        "Date": "2027-08-04 (Wed)",
        "Port / Location": "At Sea",
        "All_Ashore": "--",
        "All_Aboard": "--",
        "Departure": "--",
        "Highlights": "Pirate Night, Buccaneer Blast Fireworks at Sea, Character Meet & Greets"
    },
    {
        "Day": 6,
        "Date": "2027-08-05 (Thu)",
        "Port / Location": "Disney Lookout Cay at Lighthouse Point, Eleuthera",
        "All_Ashore": "8:30 AM",
        "All_Aboard": "5:30 PM",
        "Departure": "6:00 PM",
        "Highlights": "Disney\x27s newest island destination: Rush Out Gush Out, pristine beaches, Junkanoo celebration"
    },
    {
        "Day": 7,
        "Date": "2027-08-06 (Fri)",
        "Port / Location": "Nassau, Bahamas",
        "All_Ashore": "8:00 AM",
        "All_Aboard": "4:45 PM",
        "Departure": "5:15 PM",
        "Highlights": "Atlantis Day Pass, Straw Market, Blue Lagoon Island, Farewell Dinner"
    },
    {
        "Day": 8,
        "Date": "2027-08-07 (Sat)",
        "Port / Location": "Fort Lauderdale, FL",
        "All_Ashore": "8:00 AM (Debarkation)",
        "All_Aboard": "--",
        "Departure": "--",
        "Highlights": "Express Walk-Off or Scheduled Luggage Breakfast & Debarkation"
    }
]

df_itinerary = pd.DataFrame(daily_itinerary)
display(df_itinerary)
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Day</th>
      <th>Date</th>
      <th>Port / Location</th>
      <th>All_Ashore</th>
      <th>All_Aboard</th>
      <th>Departure</th>
      <th>Highlights</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>2027-07-31 (Sat)</td>
      <td>Fort Lauderdale, FL</td>
      <td>--</td>
      <td>4:00 PM</td>
      <td>5:00 PM</td>
      <td>Embarkation, Sail Away Deck Party, Mandatory S...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>2027-08-01 (Sun)</td>
      <td>At Sea</td>
      <td>--</td>
      <td>--</td>
      <td>--</td>
      <td>Sea Day fun: Hero Zone, AquaMouse, Pools, Disn...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>2027-08-02 (Mon)</td>
      <td>George Town, Grand Cayman (Tender Port)</td>
      <td>8:00 AM (Tendering)</td>
      <td>5:00 PM</td>
      <td>5:30 PM</td>
      <td>Stingray City, Seven Mile Beach, Cayman Turtle...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>2027-08-03 (Tue)</td>
      <td>Falmouth, Jamaica</td>
      <td>7:30 AM</td>
      <td>5:00 PM</td>
      <td>5:30 PM</td>
      <td>Dunn's River Falls, River Tubing, Jamaican Cul...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>2027-08-04 (Wed)</td>
      <td>At Sea</td>
      <td>--</td>
      <td>--</td>
      <td>--</td>
      <td>Pirate Night, Buccaneer Blast Fireworks at Sea...</td>
    </tr>
    <tr>
      <th>5</th>
      <td>6</td>
      <td>2027-08-05 (Thu)</td>
      <td>Disney Lookout Cay at Lighthouse Point, Eleuthera</td>
      <td>8:30 AM</td>
      <td>5:30 PM</td>
      <td>6:00 PM</td>
      <td>Disney's newest island destination: Rush Out G...</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7</td>
      <td>2027-08-06 (Fri)</td>
      <td>Nassau, Bahamas</td>
      <td>8:00 AM</td>
      <td>4:45 PM</td>
      <td>5:15 PM</td>
      <td>Atlantis Day Pass, Straw Market, Blue Lagoon I...</td>
    </tr>
    <tr>
      <th>7</th>
      <td>8</td>
      <td>2027-08-07 (Sat)</td>
      <td>Fort Lauderdale, FL</td>
      <td>8:00 AM (Debarkation)</td>
      <td>--</td>
      <td>--</td>
      <td>Express Walk-Off or Scheduled Luggage Breakfas...</td>
    </tr>
  </tbody>
</table>
</div>


## 4. Dining & Evening Schedule <a id="dining-schedule"></a>

- **Main Dining Assigned Seating**: **5:45 PM** (Main Seating)
- **Walt Disney Theatre Evening Show**: **8:15 PM**
- **Rotational Dining**: Experience the 3 themed main dining restaurants on the Disney Destiny (rotational schedule will appear on the Disney Cruise Line Navigator App upon boarding).
- **Pirate Night**: Night 5 (Sea Day, Aug 4) – Dress up, deck party, and fireworks!

## 5. Excursion & Port Adventure Planning <a id="excursions"></a>


```python
excursion_planner = [
    {
        "Port": "Grand Cayman (Day 3)",
        "Top Options": "Stingray City and/or Cayman Turtle Centre (Confirmed DCL Port Adventures)",
        "Status": "Shortlisting (Leaning Stingray/Turtles)",
        "Target Budget": 400.00
    },
    {
        "Port": "Falmouth, Jamaica (Day 4)",
        "Top Options": "Dunn\x27s River Falls & River Tubing, Bamboo Rafting on the Martha Brae",
        "Status": "Shortlisting (Leaning Stingray/Turtles)",
        "Target Budget": 0.00
    },
    {
        "Port": "Disney Lookout Cay at Lighthouse Point (Day 6)",
        "Top Options": "Beach Day (Included), Snorkel Gear Rental, Bicycle Rental, Cabana (if available)",
        "Status": "Planned",
        "Target Budget": 200.00
    },
    {
        "Port": "Nassau, Bahamas (Day 7)",
        "Top Options": "Blue Lagoon Island or Relax Onboard",
        "Status": "Deciding (Skipping Atlantis)",
        "Target Budget": 300.00
    },
    {
        "Port": "Onboard Disney Destiny",
        "Top Options": "Palo Brunch, Tastings (Margarita/Bourbon/Beer), Bibbidi Bobbidi (Amelia)",
        "Status": "Book on May 2, 2027",
        "Target Budget": 350.00
    }
]

df_excursions = pd.DataFrame(excursion_planner)
display(df_excursions)
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Port</th>
      <th>Top Options</th>
      <th>Status</th>
      <th>Target Budget</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Grand Cayman (Day 3)</td>
      <td>Stingray City and/or Cayman Turtle Centre (Con...</td>
      <td>Shortlisting (Leaning Stingray/Turtles)</td>
      <td>400.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Falmouth, Jamaica (Day 4)</td>
      <td>Dunn's River Falls &amp; River Tubing, Bamboo Raft...</td>
      <td>Shortlisting (Leaning Stingray/Turtles)</td>
      <td>0.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Disney Lookout Cay at Lighthouse Point (Day 6)</td>
      <td>Beach Day (Included), Snorkel Gear Rental, Bic...</td>
      <td>Planned</td>
      <td>200.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Nassau, Bahamas (Day 7)</td>
      <td>Blue Lagoon Island or Relax Onboard</td>
      <td>Deciding (Skipping Atlantis)</td>
      <td>300.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Onboard Disney Destiny</td>
      <td>Palo Brunch, Tastings (Margarita/Bourbon/Beer)...</td>
      <td>Book on May 2, 2027</td>
      <td>350.0</td>
    </tr>
  </tbody>
</table>
</div>


## 6. Budget & Expense Tracker <a id="budget-tracker"></a>


```python
# Configurable Expense Ledger
expenses = [
    {"Category": "Stateroom (Cat 04B Verandah - 7 Nights)", "Type": "Cruise Fare", "Status": "Booked", "Amount_USD": 6800.00},
    {"Category": "Taxes, Fees & Port Expenses", "Type": "Cruise Fare", "Status": "Booked", "Amount_USD": 580.00},
    {"Category": "Vacation Protection Plan (4 Guests)", "Type": "Protection", "Status": "Added", "Amount_USD": 550.00},
    {"Category": "Pre-Paid Gratuities ($14.50/person/night x 4 x 7)", "Type": "Gratuities", "Status": "Pending Pre-Pay", "Amount_USD": 14.50 * 4 * 7},
    {"Category": "Port Adventures & Excursions", "Type": "Add-On Costs", "Status": "Budgeted", "Amount_USD": 900.00},
    {"Category": "Specialty Dining & Lounges (Palo)", "Type": "Add-On Costs", "Status": "Budgeted", "Amount_USD": 200.00},
    {"Category": "Travel & Flights to FLL (PHL - American Airlines)", "Type": "Travel", "Status": "Budgeted", "Amount_USD": 1200.00},
    {"Category": "Pre-Cruise Hotel (Practical Marriott: Residence Inn / Courtyard)", "Type": "Travel", "Status": "Budgeted", "Amount_USD": 250.00}
]

df_budget = pd.DataFrame(expenses)
base_budget = df_budget[df_budget['Type'] != 'Add-On Costs']
addon_budget = df_budget[df_budget['Type'] == 'Add-On Costs']

total_base = base_budget["Amount_USD"].sum()
total_addons = addon_budget["Amount_USD"].sum()
total_exp = df_budget["Amount_USD"].sum()

per_person_base = total_base / 4

print("=" * 60)
print(f"💰 BASE ESTIMATED CRUISE BUDGET: ${total_base:,.2f}")
print(f"👤 PER-PERSON BASE (Party of 4): ${per_person_base:,.2f}")
print("-" * 60)
print(f"✨ OPTIONAL ADD-ON COSTS (Palo, Excursions): ${total_addons:,.2f}")
print("=" * 60)
print(f"💵 TOTAL POTENTIAL BUDGET: ${total_exp:,.2f}")
print("=" * 60)
display(df_budget)
```

    ============================================================
    💰 BASE ESTIMATED CRUISE BUDGET: $9,786.00
    👤 PER-PERSON BASE (Party of 4): $2,446.50
    ------------------------------------------------------------
    ✨ OPTIONAL ADD-ON COSTS (Palo, Excursions): $1,100.00
    ============================================================
    💵 TOTAL POTENTIAL BUDGET: $10,886.00
    ============================================================



<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Category</th>
      <th>Type</th>
      <th>Status</th>
      <th>Amount_USD</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Stateroom (Cat 04B Verandah - 7 Nights)</td>
      <td>Cruise Fare</td>
      <td>Booked</td>
      <td>6800.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Taxes, Fees &amp; Port Expenses</td>
      <td>Cruise Fare</td>
      <td>Booked</td>
      <td>580.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Vacation Protection Plan (4 Guests)</td>
      <td>Protection</td>
      <td>Added</td>
      <td>550.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Pre-Paid Gratuities ($14.50/person/night x 4 x 7)</td>
      <td>Gratuities</td>
      <td>Pending Pre-Pay</td>
      <td>406.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Port Adventures &amp; Excursions</td>
      <td>Add-On Costs</td>
      <td>Budgeted</td>
      <td>900.0</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Specialty Dining &amp; Lounges (Palo)</td>
      <td>Add-On Costs</td>
      <td>Budgeted</td>
      <td>200.0</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Travel &amp; Flights to FLL (PHL - American Airlines)</td>
      <td>Travel</td>
      <td>Budgeted</td>
      <td>1200.0</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Pre-Cruise Hotel (Practical Marriott: Residenc...</td>
      <td>Travel</td>
      <td>Budgeted</td>
      <td>250.0</td>
    </tr>
  </tbody>
</table>
</div>


## 7. Preparation & Document Checklist <a id="checklist"></a>

### Document & ID Requirements
- [ ] Passports valid for at least 6 months past August 7, 2027 (Katie, Andrew, Riley, Amelia)
- [ ] Online check-in submitted starting **June 28, 2027** (Passport photos, security selfies, credit card, PAT selection)
- [ ] Travel Insurance / Vacation Protection confirmed (Added)

### Pre-Cruise Travel Arrangements
- [ ] Book flights from PHL or EWR to Fort Lauderdale (FLL) or Miami (MIA) for Friday, July 30, 2027
- [ ] Book practical Marriott hotel (e.g., Residence Inn or Courtyard Airport & Cruise Port) for night of July 30
- [ ] Ground transportation / rideshare arranged to Port Everglades for July 31

### Onboard Prep & Magic
- [ ] Disney Cruise Line Navigator App installed on all phones
- [ ] Book activities on **May 2, 2027** (Port adventures, Palo reservations, spa)
- [ ] Request complimentary Disney Character Call for the kids
- [ ] Pirate Night costumes & accessories (For Night 5)
- [ ] Lanyards & Door magnets for Stateroom 9100
