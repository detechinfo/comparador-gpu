import { useState, useMemo, useCallback } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from "recharts"
import { Cpu, Monitor, Zap, X, Plus, BarChart2, Settings,
  Gamepad2, Film, Search, TrendingUp } from "lucide-react"

// ── GPU GAME DATA (52 GPUs × 39 games × 3 resolutions) ──────────────
const GG = {
  "ASUS RTX 5090 TUF 32 GB": {
    "r1080": {"Alan Wake 2": 208.2, "Assassin's Creed Mirage": 212.5, "Baldur's Gate 3": 210.7, "Black Myth Wukong": 117.9, "Counter-Strike 2": 734.8, "Cyberpunk 2077": 248.5, "DOOM Eternal": 399.3, "Dragon Age Veilguard": 194.8, "Elden Ring": 195.9, "F1 24": 375.5, "God of War Ragnarok": 208.8, "Hogwarts Legacy": 199.7, "Horizon: Forbidden West": 199.3, "No Rest for the Wicked": 292.3, "Resident Evil 4": 314.2, "Stalker 2": 149.6, "Star Wars Outlaws": 188.8, "Starfield": 185.0, "The Last of Us Pt.1": 183.4, "The Witcher 3": 547.3},
    "r1440": {"Alan Wake 2": 158.6, "Assassin's Creed Mirage": 188.6, "Baldur's Gate 3": 208.5, "Black Myth Wukong": 88.8, "Counter-Strike 2": 606.8, "Cyberpunk 2077": 213.6, "Dragon Age Veilguard": 166.1, "Elden Ring": 197.1, "F1 24": 332.7, "Ghost of Tsushima": 203.6, "Hogwarts Legacy": 155.8, "Horizon: Forbidden West": 180.6, "No Rest for the Wicked": 259.2, "Resident Evil 4": 255.3, "Stalker 2": 124.7, "Star Wars Outlaws": 139.5, "Starfield": 157.8, "The Last of Us Pt.1": 171.1, "The Witcher 3": 472.0},
    "r4k": {"Alan Wake 2": 95.5, "Assassin's Creed Mirage": 136.3, "Baldur's Gate 3": 183.0, "Black Myth Wukong": 59.9, "Counter-Strike 2": 358.9, "Cyberpunk 2077": 112.8, "DOOM Eternal": 261.5, "Elden Ring": 187.5, "F1 24": 255.6, "God of War Ragnarok": 155.3, "Hogwarts Legacy": 99.2, "Horizon: Forbidden West": 128.4, "No Rest for the Wicked": 155.2, "Resident Evil 4": 161.9, "Stalker 2": 85.6, "Star Wars Outlaws": 79.6, "Starfield": 113.6, "The Last of Us Pt.1": 113.5, "The Witcher 3": 312.5},
  },
  "Arc A580 8 GB": {
    "r1080": {"A Plague Tale: Requiem": 61.3, "Alan Wake 2": 39.1, "Assassin's Creed Mirage": 56.1, "Atomic Heart": 47.9, "Baldur's Gate 3": 76.0, "Battlefield V": 121.4, "Cities Skylines II": 18.8, "Counter-Strike 2": 122.7, "Cyberpunk 2077": 63.5, "DOOM Eternal": 116.1, "Dead Space": 61.7, "Elden Ring": 71.3, "F1 23": 61.3, "Far Cry 6": 89.3, "God of War": 52.2, "Hogwarts Legacy": 50.9, "Jedi Survivor": 49.2, "Lords of the Fallen": 31.1, "Ratchet & Clank": 48.2, "Remnant II": 45.3, "Resident Evil 4": 58.6, "Spider-Man Remastered": 88.6, "Starfield": 30.6, "The Witcher 3": 122.8},
    "r1440": {"A Plague Tale: Requiem": 43.8, "Alan Wake 2": 28.3, "Assassin's Creed Mirage": 45.0, "Atomic Heart": 39.6, "Baldur's Gate 3": 55.7, "Battlefield V": 97.4, "Cities Skylines II": 14.4, "Counter-Strike 2": 87.1, "Cyberpunk 2077": 42.0, "DOOM Eternal": 91.5, "Dead Space": 42.2, "Elden Ring": 57.0, "F1 23": 51.3, "Far Cry 6": 67.1, "God of War": 43.3, "Hogwarts Legacy": 35.7, "Jedi Survivor": 33.6, "Lords of the Fallen": 22.2, "Ratchet & Clank": 33.6, "Remnant II": 33.7, "Resident Evil 4": 41.9, "Spider-Man Remastered": 64.9, "Starfield": 24.9, "The Witcher 3": 91.9},
    "r4k": {"A Plague Tale: Requiem": 24.1, "Alan Wake 2": 17.7, "Assassin's Creed Mirage": 29.0, "Atomic Heart": 26.6, "Baldur's Gate 3": 31.0, "Battlefield V": 58.1, "Cities Skylines II": 8.3, "Counter-Strike 2": 39.5, "Cyberpunk 2077": 20.6, "DOOM Eternal": 52.9, "Dead Space": 13.0, "Elden Ring": 35.5, "F1 23": 35.1, "Far Cry 6": 37.7, "God of War": 29.6, "Hogwarts Legacy": 17.9, "Jedi Survivor": 17.7, "Lords of the Fallen": 12.2, "Ratchet & Clank": 16.3, "Remnant II": 19.9, "Resident Evil 4": 21.3, "Spider-Man Remastered": 37.7, "Starfield": 16.3, "The Witcher 3": 53.4},
  },
  "Arc A750 8 GB": {
    "r1080": {"A Plague Tale: Requiem": 70.6, "Alan Wake 2": 42.1, "Assassin's Creed Mirage": 55.9, "Atomic Heart": 58.6, "Baldur's Gate 3": 84.1, "Battlefield V": 128.0, "Cities Skylines II": 20.7, "Counter-Strike 2": 132.9, "Cyberpunk 2077": 71.2, "DOOM Eternal": 126.0, "Dead Space": 69.1, "Elden Ring": 75.9, "F1 23": 69.0, "Far Cry 6": 95.9, "God of War": 54.3, "Hogwarts Legacy": 57.7, "Jedi Survivor": 56.0, "Lords of the Fallen": 35.0, "Ratchet & Clank": 52.7, "Remnant II": 48.9, "Resident Evil 4": 66.5, "Spider-Man Remastered": 97.9, "Starfield": 30.4, "The Witcher 3": 141.5},
    "r1440": {"A Plague Tale: Requiem": 51.0, "Alan Wake 2": 31.1, "Assassin's Creed Mirage": 46.5, "Atomic Heart": 48.0, "Baldur's Gate 3": 64.0, "Battlefield V": 105.0, "Cities Skylines II": 16.3, "Counter-Strike 2": 95.0, "Cyberpunk 2077": 49.0, "DOOM Eternal": 107.7, "Dead Space": 48.6, "Elden Ring": 61.5, "F1 23": 61.0, "Far Cry 6": 74.0, "God of War": 46.7, "Hogwarts Legacy": 41.2, "Jedi Survivor": 39.1, "Lords of the Fallen": 25.7, "Ratchet & Clank": 39.1, "Remnant II": 37.6, "Resident Evil 4": 48.8, "Spider-Man Remastered": 72.8, "Starfield": 25.7, "The Witcher 3": 106.5},
    "r4k": {"A Plague Tale: Requiem": 28.4, "Alan Wake 2": 19.7, "Assassin's Creed Mirage": 25.1, "Atomic Heart": 32.2, "Baldur's Gate 3": 36.9, "Battlefield V": 66.4, "Cities Skylines II": 7.6, "Counter-Strike 2": 43.3, "Cyberpunk 2077": 24.6, "DOOM Eternal": 63.3, "Dead Space": 11.5, "Elden Ring": 39.4, "F1 23": 27.3, "Far Cry 6": 43.2, "God of War": 31.1, "Hogwarts Legacy": 22.1, "Jedi Survivor": 20.9, "Lords of the Fallen": 14.4, "Ratchet & Clank": 17.1, "Remnant II": 23.1, "Resident Evil 4": 30.1, "Spider-Man Remastered": 42.6, "Starfield": 18.1, "The Witcher 3": 61.2},
  },
  "Arc A770 16 GB": {
    "r1080": {"A Plague Tale: Requiem": 76.5, "Alan Wake 2": 51.9, "Assassin's Creed Mirage": 64.2, "Assassin's Creed Shadows": 33.0, "Atomic Heart": 61.9, "Avowed": 26.5, "Baldur's Gate 3": 92.4, "Battlefield V": 139.0, "Black Myth Wukong": 24.0, "Cities Skylines II": 22.5, "Counter-Strike 2": 146.0, "Cyberpunk 2077": 74.1, "DOOM Eternal": 146.7, "Dead Space": 74.3, "Dragon Age Veilguard": 43.5, "Elden Ring": 88.2, "F1 23": 81.2, "F1 24": 102.7, "Far Cry 6": 103.0, "Ghost of Tsushima": 71.7, "God of War": 56.0, "God of War Ragnarok": 60.1, "Hogwarts Legacy": 59.9, "Horizon: Forbidden West": 53.6, "Jedi Survivor": 60.2, "Kingdom Come 2": 70.1, "Lords of the Fallen": 37.9, "Monster Hunter Wilds": 23.1, "No Rest for the Wicked": 90.6, "Ratchet & Clank": 66.7, "Remnant II": 52.8, "Resident Evil 4": 72.0, "Spider-Man 2": 61.6, "Spider-Man Remastered": 104.0, "Stalker 2": 37.5, "Star Wars Outlaws": 26.5, "Starfield": 45.7, "The Last of Us Pt.1": 41.2, "The Witcher 3": 156.7},
    "r1440": {"A Plague Tale: Requiem": 54.8, "Alan Wake 2": 39.5, "Assassin's Creed Mirage": 53.9, "Assassin's Creed Shadows": 28.7, "Atomic Heart": 51.0, "Avowed": 19.6, "Baldur's Gate 3": 68.9, "Battlefield V": 115.1, "Black Myth Wukong": 19.1, "Cities Skylines II": 17.8, "Counter-Strike 2": 103.5, "Cyberpunk 2077": 51.5, "DOOM Eternal": 118.3, "Dead Space": 52.9, "Dragon Age Veilguard": 36.5, "Elden Ring": 70.3, "F1 23": 69.3, "F1 24": 84.9, "Far Cry 6": 80.3, "Ghost of Tsushima": 54.2, "God of War": 49.1, "God of War Ragnarok": 46.8, "Hogwarts Legacy": 44.1, "Horizon: Forbidden West": 46.4, "Jedi Survivor": 42.3, "Kingdom Come 2": 50.7, "Lords of the Fallen": 27.6, "Monster Hunter Wilds": 19.2, "No Rest for the Wicked": 58.2, "Ratchet & Clank": 48.6, "Remnant II": 41.2, "Resident Evil 4": 54.5, "Spider-Man 2": 45.8, "Spider-Man Remastered": 80.2, "Stalker 2": 28.7, "Star Wars Outlaws": 17.4, "Starfield": 37.2, "The Last of Us Pt.1": 32.6, "The Witcher 3": 117.4},
    "r4k": {"A Plague Tale: Requiem": 30.3, "Alan Wake 2": 22.7, "Assassin's Creed Mirage": 36.3, "Assassin's Creed Shadows": 20.9, "Atomic Heart": 34.5, "Avowed": 10.7, "Baldur's Gate 3": 39.1, "Battlefield V": 71.8, "Black Myth Wukong": 11.6, "Cities Skylines II": 10.4, "Counter-Strike 2": 56.1, "Cyberpunk 2077": 25.8, "DOOM Eternal": 71.4, "Dead Space": 27.4, "Dragon Age Veilguard": 24.0, "Elden Ring": 44.7, "F1 23": 49.0, "F1 24": 55.2, "Far Cry 6": 48.3, "Ghost of Tsushima": 30.8, "God of War": 34.6, "God of War Ragnarok": 28.2, "Hogwarts Legacy": 25.6, "Horizon: Forbidden West": 26.8, "Jedi Survivor": 22.4, "Kingdom Come 2": 28.2, "Lords of the Fallen": 15.2, "Monster Hunter Wilds": 12.7, "No Rest for the Wicked": 30.3, "Ratchet & Clank": 27.3, "Remnant II": 25.4, "Resident Evil 4": 32.4, "Spider-Man 2": 25.9, "Spider-Man Remastered": 45.8, "Stalker 2": 16.7, "Star Wars Outlaws": 8.8, "Starfield": 24.6, "The Last of Us Pt.1": 21.3, "The Witcher 3": 66.7},
  },
  "Arc B580 12 GB": {
    "r1080": {"Alan Wake 2": 57.8, "Assassin's Creed Shadows": 35.9, "Avowed": 29.8, "Baldur's Gate 3": 90.8, "Black Myth Wukong": 25.1, "Counter-Strike 2": 178.8, "Cyberpunk 2077": 92.1, "DOOM Eternal": 143.4, "Dragon Age Veilguard": 49.0, "Elden Ring": 104.9, "F1 24": 113.0, "Ghost of Tsushima": 80.4, "God of War Ragnarok": 62.2, "Hogwarts Legacy": 61.0, "Horizon: Forbidden West": 71.1, "Kingdom Come 2": 78.0, "Monster Hunter Wilds": 33.6, "No Rest for the Wicked": 110.2, "Spider-Man 2": 40.3, "Stalker 2": 45.4, "Star Wars Outlaws": 47.8, "Starfield": 51.5, "The Last of Us Pt.1": 59.1, "The Witcher 3": 172.7},
    "r1440": {"Alan Wake 2": 41.9, "Assassin's Creed Shadows": 31.4, "Avowed": 20.7, "Baldur's Gate 3": 68.5, "Black Myth Wukong": 19.7, "Counter-Strike 2": 124.9, "Cyberpunk 2077": 62.3, "DOOM Eternal": 112.8, "Dragon Age Veilguard": 41.9, "Elden Ring": 84.4, "F1 24": 95.1, "Ghost of Tsushima": 62.0, "God of War Ragnarok": 50.8, "Hogwarts Legacy": 45.7, "Horizon: Forbidden West": 55.8, "Kingdom Come 2": 53.6, "Monster Hunter Wilds": 26.7, "No Rest for the Wicked": 68.4, "Spider-Man 2": 31.7, "Stalker 2": 33.0, "Star Wars Outlaws": 32.1, "Starfield": 38.5, "The Last of Us Pt.1": 45.6, "The Witcher 3": 130.9},
    "r4k": {"Alan Wake 2": 23.4, "Assassin's Creed Shadows": 23.3, "Avowed": 11.3, "Baldur's Gate 3": 39.3, "Black Myth Wukong": 12.4, "Counter-Strike 2": 72.7, "Cyberpunk 2077": 30.9, "DOOM Eternal": 70.4, "Dragon Age Veilguard": 29.4, "Elden Ring": 54.5, "F1 24": 62.3, "Ghost of Tsushima": 35.7, "God of War Ragnarok": 32.2, "Hogwarts Legacy": 29.8, "Horizon: Forbidden West": 35.3, "Kingdom Come 2": 31.3, "Monster Hunter Wilds": 16.6, "No Rest for the Wicked": 35.1, "Spider-Man 2": 21.9, "Stalker 2": 20.4, "Star Wars Outlaws": 16.3, "Starfield": 25.6, "The Last of Us Pt.1": 24.2, "The Witcher 3": 76.8},
  },
  "GTX 1060 6 GB": {
    "r1080": {"A Plague Tale: Requiem": 31.8, "Alan Wake 2": 10.8, "Assassin's Creed Mirage": 34.2, "Atomic Heart": 23.1, "Baldur's Gate 3": 41.2, "Battlefield V": 72.2, "Cities Skylines II": 9.6, "Counter-Strike 2": 100.1, "Cyberpunk 2077": 28.1, "DOOM Eternal": 46.9, "Dead Space": 22.2, "Elden Ring": 45.1, "F1 23": 37.8, "Far Cry 6": 50.6, "God of War": 33.7, "Hogwarts Legacy": 24.9, "Jedi Survivor": 24.6, "Lords of the Fallen": 14.6, "Ratchet & Clank": 25.7, "Remnant II": 27.9, "Resident Evil 4": 25.8, "Spider-Man Remastered": 54.0, "Starfield": 16.4, "The Witcher 3": 59.7},
    "r1440": {"A Plague Tale: Requiem": 21.3, "Alan Wake 2": 9.0, "Assassin's Creed Mirage": 24.6, "Atomic Heart": 18.2, "Baldur's Gate 3": 28.5, "Battlefield V": 55.0, "Cities Skylines II": 7.2, "Counter-Strike 2": 66.6, "Cyberpunk 2077": 16.4, "DOOM Eternal": 38.6, "Dead Space": 14.5, "Elden Ring": 34.2, "F1 23": 30.6, "Far Cry 6": 35.8, "God of War": 26.1, "Hogwarts Legacy": 16.6, "Jedi Survivor": 15.7, "Lords of the Fallen": 9.8, "Ratchet & Clank": 16.5, "Remnant II": 19.5, "Resident Evil 4": 17.8, "Spider-Man Remastered": 38.4, "Starfield": 12.4, "The Witcher 3": 44.5},
    "r4k": {"A Plague Tale: Requiem": 11.1, "Alan Wake 2": 6.2, "Assassin's Creed Mirage": 13.4, "Atomic Heart": 11.7, "Baldur's Gate 3": 15.3, "Battlefield V": 30.0, "Cities Skylines II": 3.4, "Counter-Strike 2": 34.1, "Cyberpunk 2077": 6.7, "DOOM Eternal": 22.7, "Dead Space": 7.1, "Elden Ring": 20.5, "F1 23": 19.0, "Far Cry 6": 17.3, "God of War": 16.4, "Hogwarts Legacy": 8.1, "Jedi Survivor": 7.8, "Lords of the Fallen": 4.3, "Ratchet & Clank": 9.2, "Remnant II": 10.4, "Resident Evil 4": 9.1, "Spider-Man Remastered": 18.0, "Starfield": 7.3, "The Witcher 3": 25.6},
  },
  "GTX 1660 Ti 6 GB": {
    "r1080": {"A Plague Tale: Requiem": 43.2, "Alan Wake 2": 28.6, "Assassin's Creed Mirage": 53.3, "Atomic Heart": 31.6, "Baldur's Gate 3": 59.3, "Battlefield V": 100.2, "Cities Skylines II": 12.2, "Counter-Strike 2": 136.4, "Cyberpunk 2077": 45.0, "DOOM Eternal": 68.5, "Dead Space": 39.2, "Elden Ring": 58.7, "F1 23": 59.7, "Far Cry 6": 74.9, "God of War": 45.4, "Hogwarts Legacy": 37.2, "Jedi Survivor": 40.1, "Lords of the Fallen": 23.6, "Ratchet & Clank": 35.1, "Remnant II": 41.1, "Resident Evil 4": 39.4, "Spider-Man Remastered": 66.7, "Starfield": 24.6, "The Witcher 3": 82.5},
    "r1440": {"A Plague Tale: Requiem": 29.4, "Alan Wake 2": 19.7, "Assassin's Creed Mirage": 36.8, "Atomic Heart": 25.5, "Baldur's Gate 3": 42.1, "Battlefield V": 76.0, "Cities Skylines II": 8.3, "Counter-Strike 2": 91.0, "Cyberpunk 2077": 26.9, "DOOM Eternal": 57.8, "Dead Space": 28.3, "Elden Ring": 44.6, "F1 23": 46.3, "Far Cry 6": 51.8, "God of War": 35.9, "Hogwarts Legacy": 23.6, "Jedi Survivor": 25.5, "Lords of the Fallen": 16.3, "Ratchet & Clank": 23.0, "Remnant II": 28.6, "Resident Evil 4": 26.9, "Spider-Man Remastered": 53.9, "Starfield": 19.3, "The Witcher 3": 61.7},
    "r4k": {"A Plague Tale: Requiem": 15.5, "Alan Wake 2": 11.7, "Assassin's Creed Mirage": 20.0, "Atomic Heart": 16.1, "Baldur's Gate 3": 22.3, "Battlefield V": 44.0, "Cities Skylines II": 3.3, "Counter-Strike 2": 46.0, "Cyberpunk 2077": 10.9, "DOOM Eternal": 35.6, "Dead Space": 12.7, "Elden Ring": 26.6, "F1 23": 24.6, "Far Cry 6": 5.8, "God of War": 22.3, "Hogwarts Legacy": 10.4, "Jedi Survivor": 12.4, "Lords of the Fallen": 6.0, "Ratchet & Clank": 11.8, "Remnant II": 15.3, "Resident Evil 4": 13.6, "Spider-Man Remastered": 21.3, "Starfield": 11.5, "The Witcher 3": 36.1},
  },
  "RTX 2060 6 GB": {
    "r1080": {"A Plague Tale: Requiem": 51.4, "Alan Wake 2": 36.1, "Assassin's Creed Mirage": 59.7, "Assassin's Creed Shadows": 20.7, "Atomic Heart": 38.2, "Avowed": 24.4, "Baldur's Gate 3": 69.8, "Battlefield V": 116.2, "Black Myth Wukong": 18.4, "Cities Skylines II": 17.9, "Counter-Strike 2": 166.1, "Cyberpunk 2077": 59.0, "DOOM Eternal": 79.0, "Dead Space": 45.3, "Dragon Age Veilguard": 33.7, "Elden Ring": 71.8, "F1 23": 67.2, "F1 24": 76.8, "Far Cry 6": 84.8, "Ghost of Tsushima": 49.9, "God of War": 56.6, "God of War Ragnarok": 43.5, "Hogwarts Legacy": 46.7, "Horizon: Forbidden West": 46.8, "Jedi Survivor": 46.9, "Kingdom Come 2": 51.9, "Lords of the Fallen": 28.6, "Monster Hunter Wilds": 10.7, "No Rest for the Wicked": 65.8, "Ratchet & Clank": 40.3, "Remnant II": 48.1, "Resident Evil 4": 48.2, "Spider-Man 2": 36.6, "Spider-Man Remastered": 85.9, "Stalker 2": 12.5, "Star Wars Outlaws": 28.2, "Starfield": 34.9, "The Last of Us Pt.1": 27.7, "The Witcher 3": 101.0},
    "r1440": {"A Plague Tale: Requiem": 35.3, "Alan Wake 2": 24.7, "Assassin's Creed Mirage": 42.7, "Assassin's Creed Shadows": 17.4, "Atomic Heart": 30.6, "Avowed": 16.0, "Baldur's Gate 3": 48.8, "Battlefield V": 90.6, "Black Myth Wukong": 12.4, "Cities Skylines II": 12.4, "Counter-Strike 2": 109.7, "Cyberpunk 2077": 36.4, "DOOM Eternal": 63.3, "Dead Space": 32.7, "Dragon Age Veilguard": 24.4, "Elden Ring": 54.3, "F1 23": 52.1, "F1 24": 54.8, "Far Cry 6": 55.6, "Ghost of Tsushima": 35.6, "God of War": 44.4, "God of War Ragnarok": 33.0, "Hogwarts Legacy": 32.4, "Horizon: Forbidden West": 35.3, "Jedi Survivor": 30.5, "Kingdom Come 2": 34.2, "Lords of the Fallen": 19.3, "Monster Hunter Wilds": 8.3, "No Rest for the Wicked": 40.7, "Ratchet & Clank": 26.6, "Remnant II": 33.8, "Resident Evil 4": 32.8, "Spider-Man 2": 25.1, "Spider-Man Remastered": 62.2, "Stalker 2": 23.3, "Star Wars Outlaws": 19.0, "Starfield": 26.9, "The Last of Us Pt.1": 17.4, "The Witcher 3": 75.5},
    "r4k": {"A Plague Tale: Requiem": 18.7, "Alan Wake 2": 13.3, "Assassin's Creed Mirage": 23.8, "Assassin's Creed Shadows": 10.4, "Atomic Heart": 19.9, "Avowed": 7.2, "Baldur's Gate 3": 27.4, "Battlefield V": 53.0, "Black Myth Wukong": 4.0, "Cities Skylines II": 5.0, "Counter-Strike 2": 55.7, "Cyberpunk 2077": 15.3, "DOOM Eternal": 40.6, "Dead Space": 17.3, "Dragon Age Veilguard": 13.5, "Elden Ring": 32.1, "F1 23": 32.8, "F1 24": 26.5, "Far Cry 6": 3.8, "Ghost of Tsushima": 18.5, "God of War": 27.5, "God of War Ragnarok": 16.0, "Hogwarts Legacy": 15.0, "Horizon: Forbidden West": 16.4, "Jedi Survivor": 14.2, "Kingdom Come 2": 16.1, "Lords of the Fallen": 7.7, "Monster Hunter Wilds": 6.2, "No Rest for the Wicked": 21.5, "Ratchet & Clank": 14.6, "Remnant II": 18.6, "Resident Evil 4": 16.3, "Spider-Man 2": 12.9, "Spider-Man Remastered": 28.2, "Stalker 2": 1.2, "Star Wars Outlaws": 6.9, "Starfield": 16.5, "The Last of Us Pt.1": 6.9, "The Witcher 3": 44.0},
  },
  "RTX 3050 8 GB": {
    "r1080": {"A Plague Tale: Requiem": 43.7, "Alan Wake 2": 33.3, "Assassin's Creed Mirage": 57.8, "Assassin's Creed Shadows": 19.3, "Atomic Heart": 31.1, "Avowed": 22.6, "Baldur's Gate 3": 60.3, "Battlefield V": 108.0, "Black Myth Wukong": 16.4, "Cities Skylines II": 15.4, "Counter-Strike 2": 133.3, "Cyberpunk 2077": 49.1, "DOOM Eternal": 83.0, "Dead Space": 45.4, "Dragon Age Veilguard": 31.6, "Elden Ring": 59.5, "F1 23": 64.9, "F1 24": 71.3, "Far Cry 6": 74.6, "Ghost of Tsushima": 44.7, "God of War": 48.1, "God of War Ragnarok": 40.5, "Hogwarts Legacy": 36.4, "Horizon: Forbidden West": 40.2, "Jedi Survivor": 40.2, "Kingdom Come 2": 43.9, "Lords of the Fallen": 26.4, "Monster Hunter Wilds": 21.8, "No Rest for the Wicked": 57.9, "Ratchet & Clank": 39.0, "Remnant II": 44.6, "Resident Evil 4": 39.7, "Spider-Man 2": 41.3, "Spider-Man Remastered": 78.8, "Stalker 2": 29.8, "Star Wars Outlaws": 26.4, "Starfield": 31.7, "The Last of Us Pt.1": 31.7, "The Witcher 3": 81.9},
    "r1440": {"A Plague Tale: Requiem": 30.5, "Alan Wake 2": 23.9, "Assassin's Creed Mirage": 43.4, "Assassin's Creed Shadows": 15.0, "Atomic Heart": 25.5, "Avowed": 15.1, "Baldur's Gate 3": 43.2, "Battlefield V": 80.9, "Black Myth Wukong": 12.3, "Cities Skylines II": 10.8, "Counter-Strike 2": 88.7, "Cyberpunk 2077": 29.2, "DOOM Eternal": 67.2, "Dead Space": 30.8, "Dragon Age Veilguard": 23.8, "Elden Ring": 44.8, "F1 23": 51.6, "F1 24": 56.7, "Far Cry 6": 52.4, "Ghost of Tsushima": 32.2, "God of War": 38.4, "God of War Ragnarok": 32.0, "Hogwarts Legacy": 25.4, "Horizon: Forbidden West": 30.0, "Jedi Survivor": 25.9, "Kingdom Come 2": 29.6, "Lords of the Fallen": 18.0, "Monster Hunter Wilds": 17.1, "No Rest for the Wicked": 35.7, "Ratchet & Clank": 29.0, "Remnant II": 31.4, "Resident Evil 4": 27.0, "Spider-Man 2": 27.2, "Spider-Man Remastered": 57.8, "Stalker 2": 20.7, "Star Wars Outlaws": 17.2, "Starfield": 24.0, "The Last of Us Pt.1": 16.2, "The Witcher 3": 62.2},
    "r4k": {"A Plague Tale: Requiem": 16.3, "Alan Wake 2": 10.6, "Assassin's Creed Mirage": 25.0, "Assassin's Creed Shadows": 9.3, "Atomic Heart": 17.2, "Avowed": 7.0, "Baldur's Gate 3": 24.0, "Battlefield V": 44.9, "Black Myth Wukong": 6.2, "Cities Skylines II": 4.5, "Counter-Strike 2": 44.5, "Cyberpunk 2077": 12.9, "DOOM Eternal": 36.1, "Dead Space": 15.5, "Dragon Age Veilguard": 13.6, "Elden Ring": 26.2, "F1 23": 33.0, "F1 24": 30.4, "Far Cry 6": 27.9, "Ghost of Tsushima": 17.9, "God of War": 23.9, "God of War Ragnarok": 19.3, "Hogwarts Legacy": 13.5, "Horizon: Forbidden West": 17.6, "Jedi Survivor": 13.0, "Kingdom Come 2": 15.2, "Lords of the Fallen": 9.1, "Monster Hunter Wilds": 8.5, "No Rest for the Wicked": 19.0, "Ratchet & Clank": 15.7, "Remnant II": 16.8, "Resident Evil 4": 16.1, "Spider-Man 2": 13.1, "Spider-Man Remastered": 31.8, "Stalker 2": 10.9, "Star Wars Outlaws": 6.2, "Starfield": 14.4, "The Last of Us Pt.1": 8.5, "The Witcher 3": 37.1},
  },
  "RTX 3050 Pegasus 6 GB": {
    "r1080": {"A Plague Tale: Requiem": 33.3, "Alan Wake 2": 24.6, "Assassin's Creed Mirage": 46.7, "Atomic Heart": 24.2, "Baldur's Gate 3": 48.1, "Battlefield V": 89.8, "Cities Skylines II": 13.0, "Counter-Strike 2": 103.7, "Cyberpunk 2077": 37.7, "DOOM Eternal": 61.5, "Dead Space": 36.9, "Elden Ring": 46.7, "F1 23": 48.4, "Far Cry 6": 62.2, "God of War": 37.4, "Hogwarts Legacy": 29.3, "Jedi Survivor": 31.3, "Lords of the Fallen": 20.3, "Ratchet & Clank": 32.9, "Remnant II": 35.6, "Resident Evil 4": 31.3, "Spider-Man Remastered": 56.8, "Starfield": 22.4, "The Witcher 3": 63.7},
    "r1440": {"A Plague Tale: Requiem": 22.9, "Alan Wake 2": 17.4, "Assassin's Creed Mirage": 31.6, "Atomic Heart": 19.5, "Baldur's Gate 3": 34.3, "Battlefield V": 64.6, "Cities Skylines II": 8.8, "Counter-Strike 2": 69.6, "Cyberpunk 2077": 22.2, "DOOM Eternal": 51.0, "Dead Space": 25.6, "Elden Ring": 34.6, "F1 23": 39.1, "Far Cry 6": 42.2, "God of War": 29.4, "Hogwarts Legacy": 18.9, "Jedi Survivor": 19.9, "Lords of the Fallen": 13.4, "Ratchet & Clank": 20.8, "Remnant II": 24.8, "Resident Evil 4": 21.4, "Spider-Man Remastered": 45.3, "Starfield": 17.2, "The Witcher 3": 47.6},
    "r4k": {"A Plague Tale: Requiem": 12.4, "Alan Wake 2": 9.4, "Assassin's Creed Mirage": 18.3, "Atomic Heart": 12.7, "Baldur's Gate 3": 18.8, "Battlefield V": 35.6, "Cities Skylines II": 3.5, "Counter-Strike 2": 35.0, "Cyberpunk 2077": 9.7, "DOOM Eternal": 30.9, "Dead Space": 11.6, "Elden Ring": 20.2, "F1 23": 22.9, "Far Cry 6": 7.5, "God of War": 18.2, "Hogwarts Legacy": 8.9, "Jedi Survivor": 9.6, "Lords of the Fallen": 5.1, "Ratchet & Clank": 11.0, "Remnant II": 13.1, "Resident Evil 4": 11.5, "Spider-Man Remastered": 19.9, "Starfield": 10.0, "The Witcher 3": 28.0},
  },
  "RTX 3060 12 GB": {
    "r1080": {"A Plague Tale: Requiem": 61.5, "Alan Wake 2": 46.2, "Assassin's Creed Mirage": 73.9, "Assassin's Creed Shadows": 24.9, "Atomic Heart": 44.3, "Avowed": 31.3, "Baldur's Gate 3": 86.9, "Battlefield V": 145.5, "Black Myth Wukong": 23.2, "Cities Skylines II": 21.7, "Counter-Strike 2": 189.8, "Cyberpunk 2077": 68.5, "DOOM Eternal": 109.3, "Dead Space": 63.8, "Dragon Age Veilguard": 43.2, "Elden Ring": 81.8, "F1 23": 89.5, "F1 24": 98.5, "Far Cry 6": 102.2, "Ghost of Tsushima": 61.1, "God of War": 67.0, "God of War Ragnarok": 55.9, "Hogwarts Legacy": 49.8, "Horizon: Forbidden West": 55.4, "Jedi Survivor": 55.2, "Kingdom Come 2": 62.0, "Lords of the Fallen": 36.8, "Monster Hunter Wilds": 29.5, "No Rest for the Wicked": 78.9, "Ratchet & Clank": 65.9, "Remnant II": 60.4, "Resident Evil 4": 56.8, "Spider-Man 2": 60.8, "Spider-Man Remastered": 107.2, "Stalker 2": 42.3, "Star Wars Outlaws": 36.7, "Starfield": 42.8, "The Last of Us Pt.1": 47.9, "The Witcher 3": 116.5},
    "r1440": {"A Plague Tale: Requiem": 43.4, "Alan Wake 2": 33.1, "Assassin's Creed Mirage": 57.1, "Assassin's Creed Shadows": 20.3, "Atomic Heart": 35.7, "Avowed": 21.1, "Baldur's Gate 3": 61.4, "Battlefield V": 113.2, "Black Myth Wukong": 17.6, "Cities Skylines II": 16.2, "Counter-Strike 2": 127.6, "Cyberpunk 2077": 41.6, "DOOM Eternal": 90.2, "Dead Space": 41.9, "Dragon Age Veilguard": 33.4, "Elden Ring": 62.6, "F1 23": 72.9, "F1 24": 80.0, "Far Cry 6": 73.9, "Ghost of Tsushima": 45.0, "God of War": 53.8, "God of War Ragnarok": 44.4, "Hogwarts Legacy": 36.6, "Horizon: Forbidden West": 41.9, "Jedi Survivor": 36.1, "Kingdom Come 2": 42.2, "Lords of the Fallen": 25.3, "Monster Hunter Wilds": 23.5, "No Rest for the Wicked": 49.0, "Ratchet & Clank": 46.6, "Remnant II": 43.3, "Resident Evil 4": 39.1, "Spider-Man 2": 42.2, "Spider-Man Remastered": 75.8, "Stalker 2": 30.2, "Star Wars Outlaws": 24.4, "Starfield": 33.4, "The Last of Us Pt.1": 34.9, "The Witcher 3": 88.9},
    "r4k": {"A Plague Tale: Requiem": 23.3, "Alan Wake 2": 18.1, "Assassin's Creed Mirage": 34.4, "Assassin's Creed Shadows": 13.6, "Atomic Heart": 24.4, "Avowed": 11.0, "Baldur's Gate 3": 33.4, "Battlefield V": 63.8, "Black Myth Wukong": 10.2, "Cities Skylines II": 7.2, "Counter-Strike 2": 64.8, "Cyberpunk 2077": 18.4, "DOOM Eternal": 56.6, "Dead Space": 21.6, "Dragon Age Veilguard": 19.2, "Elden Ring": 37.2, "F1 23": 47.3, "F1 24": 51.0, "Far Cry 6": 41.0, "Ghost of Tsushima": 25.9, "God of War": 34.2, "God of War Ragnarok": 27.1, "Hogwarts Legacy": 19.0, "Horizon: Forbidden West": 25.3, "Jedi Survivor": 18.2, "Kingdom Come 2": 21.8, "Lords of the Fallen": 13.2, "Monster Hunter Wilds": 14.8, "No Rest for the Wicked": 26.5, "Ratchet & Clank": 26.1, "Remnant II": 23.6, "Resident Evil 4": 23.3, "Spider-Man 2": 22.4, "Spider-Man Remastered": 44.0, "Stalker 2": 16.2, "Star Wars Outlaws": 10.4, "Starfield": 20.7, "The Last of Us Pt.1": 19.3, "The Witcher 3": 53.4},
  },
  "RTX 3060 Ti 8 GB": {
    "r1080": {"Alan Wake 2": 61.1, "Assassin's Creed Shadows": 33.2, "Avowed": 40.7, "Baldur's Gate 3": 108.3, "Black Myth Wukong": 30.7, "Counter-Strike 2": 254.6, "Cyberpunk 2077": 89.0, "DOOM Eternal": 142.8, "Dragon Age Veilguard": 57.3, "Elden Ring": 107.2, "F1 24": 129.0, "Ghost of Tsushima": 80.2, "God of War Ragnarok": 74.4, "Hogwarts Legacy": 67.1, "Horizon: Forbidden West": 73.5, "Kingdom Come 2": 81.2, "Monster Hunter Wilds": 37.0, "No Rest for the Wicked": 104.8, "Spider-Man 2": 77.1, "Stalker 2": 53.6, "Star Wars Outlaws": 48.9, "Starfield": 57.6, "The Last of Us Pt.1": 59.3, "The Witcher 3": 158.0},
    "r1440": {"Alan Wake 2": 43.7, "Assassin's Creed Shadows": 25.8, "Avowed": 27.6, "Baldur's Gate 3": 78.2, "Black Myth Wukong": 23.5, "Counter-Strike 2": 173.6, "Cyberpunk 2077": 55.0, "DOOM Eternal": 116.9, "Dragon Age Veilguard": 43.8, "Elden Ring": 82.4, "F1 24": 102.9, "Ghost of Tsushima": 59.5, "God of War Ragnarok": 58.9, "Hogwarts Legacy": 50.6, "Horizon: Forbidden West": 55.9, "Kingdom Come 2": 55.8, "Monster Hunter Wilds": 24.8, "No Rest for the Wicked": 66.2, "Spider-Man 2": 51.4, "Stalker 2": 38.9, "Star Wars Outlaws": 32.5, "Starfield": 44.8, "The Last of Us Pt.1": 41.4, "The Witcher 3": 120.2},
    "r4k": {"Alan Wake 2": 22.6, "Assassin's Creed Shadows": 18.1, "Avowed": 13.7, "Baldur's Gate 3": 44.4, "Black Myth Wukong": 12.0, "Counter-Strike 2": 89.0, "Cyberpunk 2077": 25.5, "DOOM Eternal": 68.0, "Dragon Age Veilguard": 25.0, "Elden Ring": 49.5, "F1 24": 58.0, "Ghost of Tsushima": 34.4, "God of War Ragnarok": 35.7, "Hogwarts Legacy": 26.8, "Horizon: Forbidden West": 34.3, "Kingdom Come 2": 29.4, "Monster Hunter Wilds": 11.6, "No Rest for the Wicked": 36.2, "Spider-Man 2": 25.4, "Stalker 2": 21.8, "Star Wars Outlaws": 14.4, "Starfield": 27.4, "The Last of Us Pt.1": 15.7, "The Witcher 3": 71.9},
  },
  "RTX 3070 8 GB": {
    "r1080": {"Alan Wake 2": 70.4, "Assassin's Creed Shadows": 36.4, "Avowed": 46.8, "Baldur's Gate 3": 128.1, "Black Myth Wukong": 35.6, "Counter-Strike 2": 300.2, "Cyberpunk 2077": 103.6, "DOOM Eternal": 162.7, "Dragon Age Veilguard": 65.6, "Elden Ring": 119.1, "F1 24": 150.9, "Ghost of Tsushima": 89.9, "God of War Ragnarok": 87.8, "Hogwarts Legacy": 80.3, "Horizon: Forbidden West": 84.2, "Kingdom Come 2": 92.9, "Monster Hunter Wilds": 43.6, "No Rest for the Wicked": 123.1, "Spider-Man 2": 88.2, "Stalker 2": 60.3, "Star Wars Outlaws": 56.9, "Starfield": 66.0, "The Last of Us Pt.1": 64.3, "The Witcher 3": 182.1},
    "r1440": {"Alan Wake 2": 51.2, "Assassin's Creed Shadows": 31.0, "Avowed": 32.1, "Baldur's Gate 3": 91.2, "Black Myth Wukong": 27.3, "Counter-Strike 2": 207.4, "Cyberpunk 2077": 64.8, "DOOM Eternal": 135.4, "Dragon Age Veilguard": 51.3, "Elden Ring": 92.6, "F1 24": 120.8, "Ghost of Tsushima": 66.7, "God of War Ragnarok": 69.9, "Hogwarts Legacy": 56.2, "Horizon: Forbidden West": 64.7, "Kingdom Come 2": 64.9, "Monster Hunter Wilds": 31.1, "No Rest for the Wicked": 77.9, "Spider-Man 2": 59.2, "Stalker 2": 44.3, "Star Wars Outlaws": 38.9, "Starfield": 51.5, "The Last of Us Pt.1": 45.3, "The Witcher 3": 139.0},
    "r4k": {"Alan Wake 2": 25.8, "Assassin's Creed Shadows": 20.2, "Avowed": 16.1, "Baldur's Gate 3": 51.4, "Black Myth Wukong": 13.3, "Counter-Strike 2": 106.2, "Cyberpunk 2077": 30.9, "DOOM Eternal": 77.8, "Dragon Age Veilguard": 29.1, "Elden Ring": 56.1, "F1 24": 65.2, "Ghost of Tsushima": 38.4, "God of War Ragnarok": 41.9, "Hogwarts Legacy": 32.3, "Horizon: Forbidden West": 39.7, "Kingdom Come 2": 34.1, "Monster Hunter Wilds": 12.4, "No Rest for the Wicked": 42.6, "Spider-Man 2": 29.1, "Stalker 2": 22.6, "Star Wars Outlaws": 19.3, "Starfield": 32.5, "The Last of Us Pt.1": 24.6, "The Witcher 3": 83.0},
  },
  "RTX 3080 10 GB": {
    "r1080": {"Alan Wake 2": 90.5, "Assassin's Creed Shadows": 44.5, "Avowed": 60.7, "Baldur's Gate 3": 156.8, "Black Myth Wukong": 45.0, "Counter-Strike 2": 366.4, "Cyberpunk 2077": 130.4, "DOOM Eternal": 206.0, "Dragon Age Veilguard": 82.1, "Elden Ring": 147.1, "F1 24": 199.5, "Ghost of Tsushima": 111.3, "God of War Ragnarok": 111.3, "Hogwarts Legacy": 94.6, "Horizon: Forbidden West": 98.7, "Kingdom Come 2": 116.1, "Monster Hunter Wilds": 54.1, "No Rest for the Wicked": 155.8, "Spider-Man 2": 110.2, "Stalker 2": 74.6, "Star Wars Outlaws": 74.4, "Starfield": 82.6, "The Last of Us Pt.1": 91.5, "The Witcher 3": 227.4},
    "r1440": {"Alan Wake 2": 66.4, "Assassin's Creed Shadows": 37.2, "Avowed": 43.1, "Baldur's Gate 3": 118.9, "Black Myth Wukong": 35.6, "Counter-Strike 2": 256.8, "Cyberpunk 2077": 84.8, "DOOM Eternal": 173.1, "Dragon Age Veilguard": 64.5, "Elden Ring": 117.3, "F1 24": 163.7, "Ghost of Tsushima": 85.2, "God of War Ragnarok": 89.9, "Hogwarts Legacy": 69.9, "Horizon: Forbidden West": 78.5, "Kingdom Come 2": 83.8, "Monster Hunter Wilds": 44.2, "No Rest for the Wicked": 99.7, "Spider-Man 2": 81.0, "Stalker 2": 55.6, "Star Wars Outlaws": 51.2, "Starfield": 65.9, "The Last of Us Pt.1": 68.1, "The Witcher 3": 178.6},
    "r4k": {"Alan Wake 2": 38.1, "Assassin's Creed Shadows": 26.9, "Avowed": 23.8, "Baldur's Gate 3": 69.3, "Black Myth Wukong": 22.1, "Counter-Strike 2": 134.0, "Cyberpunk 2077": 40.8, "DOOM Eternal": 113.4, "Dragon Age Veilguard": 40.3, "Elden Ring": 73.8, "F1 24": 108.2, "Ghost of Tsushima": 51.5, "God of War Ragnarok": 56.6, "Hogwarts Legacy": 41.0, "Horizon: Forbidden West": 50.3, "Kingdom Come 2": 46.0, "Monster Hunter Wilds": 29.7, "No Rest for the Wicked": 56.8, "Spider-Man 2": 45.8, "Stalker 2": 33.8, "Star Wars Outlaws": 27.5, "Starfield": 43.1, "The Last of Us Pt.1": 34.9, "The Witcher 3": 111.3},
  },
  "RTX 3090 24 GB": {
    "r1080": {"Alan Wake 2": 101.3, "Assassin's Creed Mirage": 123.8, "Baldur's Gate 3": 168.6, "Black Myth Wukong": 51.0, "Counter-Strike 2": 403.6, "Cyberpunk 2077": 144.5, "DOOM Eternal": 226.6, "Dragon Age Veilguard": 91.8, "Elden Ring": 164.0, "F1 24": 202.1, "God of War Ragnarok": 128.1, "Hogwarts Legacy": 103.1, "Horizon: Forbidden West": 109.8, "No Rest for the Wicked": 165.9, "Resident Evil 4": 134.0, "Stalker 2": 80.4, "Star Wars Outlaws": 83.8, "Starfield": 94.7, "The Last of Us Pt.1": 101.4, "The Witcher 3": 257.3},
    "r1440": {"Alan Wake 2": 74.2, "Assassin's Creed Mirage": 104.9, "Baldur's Gate 3": 135.0, "Black Myth Wukong": 40.1, "Counter-Strike 2": 289.1, "Cyberpunk 2077": 95.3, "Dragon Age Veilguard": 73.0, "Elden Ring": 132.1, "F1 24": 166.0, "Ghost of Tsushima": 95.4, "Hogwarts Legacy": 78.1, "Horizon: Forbidden West": 87.1, "No Rest for the Wicked": 108.7, "Resident Evil 4": 98.1, "Stalker 2": 63.4, "Star Wars Outlaws": 57.0, "Starfield": 75.9, "The Last of Us Pt.1": 76.8, "The Witcher 3": 201.9},
    "r4k": {"Alan Wake 2": 42.8, "Assassin's Creed Mirage": 70.0, "Baldur's Gate 3": 79.3, "Black Myth Wukong": 24.9, "Counter-Strike 2": 152.4, "Cyberpunk 2077": 46.5, "DOOM Eternal": 126.1, "Elden Ring": 84.6, "F1 24": 114.5, "God of War Ragnarok": 63.8, "Hogwarts Legacy": 43.2, "Horizon: Forbidden West": 57.3, "No Rest for the Wicked": 61.7, "Resident Evil 4": 61.2, "Stalker 2": 39.1, "Star Wars Outlaws": 30.9, "Starfield": 50.0, "The Last of Us Pt.1": 46.2, "The Witcher 3": 126.8},
  },
  "RTX 3090 Ti 24 GB": {
    "r1080": {"Alan Wake 2": 110.7, "Assassin's Creed Mirage": 131.3, "Assassin's Creed Shadows": 58.3, "Avowed": 73.7, "Baldur's Gate 3": 192.7, "Black Myth Wukong": 61.4, "Counter-Strike 2": 441.9, "Cyberpunk 2077": 159.3, "DOOM Eternal": 243.6, "Dragon Age Veilguard": 104.0, "Elden Ring": 173.6, "F1 24": 223.4, "Ghost of Tsushima": 131.6, "God of War Ragnarok": 137.5, "Hogwarts Legacy": 115.6, "Horizon: Forbidden West": 119.1, "Kingdom Come 2": 137.9, "Monster Hunter Wilds": 62.0, "No Rest for the Wicked": 185.8, "Resident Evil 4": 148.1, "Spider-Man 2": 139.2, "Stalker 2": 89.5, "Star Wars Outlaws": 93.8, "Starfield": 104.0, "The Last of Us Pt.1": 107.4, "The Witcher 3": 280.7},
    "r1440": {"Alan Wake 2": 82.7, "Assassin's Creed Mirage": 111.0, "Assassin's Creed Shadows": 48.0, "Avowed": 53.8, "Baldur's Gate 3": 150.6, "Black Myth Wukong": 44.7, "Counter-Strike 2": 313.7, "Cyberpunk 2077": 106.9, "DOOM Eternal": 207.7, "Dragon Age Veilguard": 83.0, "Elden Ring": 142.6, "F1 24": 189.5, "Ghost of Tsushima": 104.9, "God of War Ragnarok": 111.0, "Hogwarts Legacy": 85.6, "Horizon: Forbidden West": 96.7, "Kingdom Come 2": 103.9, "Monster Hunter Wilds": 52.8, "No Rest for the Wicked": 121.7, "Resident Evil 4": 109.5, "Spider-Man 2": 102.8, "Stalker 2": 72.0, "Star Wars Outlaws": 66.1, "Starfield": 84.6, "The Last of Us Pt.1": 83.3, "The Witcher 3": 226.2},
    "r4k": {"Alan Wake 2": 48.5, "Assassin's Creed Mirage": 76.6, "Assassin's Creed Shadows": 34.7, "Avowed": 30.4, "Baldur's Gate 3": 89.4, "Black Myth Wukong": 28.2, "Counter-Strike 2": 167.5, "Cyberpunk 2077": 52.8, "DOOM Eternal": 141.4, "Dragon Age Veilguard": 52.9, "Elden Ring": 93.8, "F1 24": 131.2, "Ghost of Tsushima": 65.5, "God of War Ragnarok": 72.0, "Hogwarts Legacy": 48.1, "Horizon: Forbidden West": 64.2, "Kingdom Come 2": 59.1, "Monster Hunter Wilds": 36.3, "No Rest for the Wicked": 70.6, "Resident Evil 4": 68.5, "Spider-Man 2": 60.8, "Stalker 2": 44.2, "Star Wars Outlaws": 35.7, "Starfield": 56.0, "The Last of Us Pt.1": 50.9, "The Witcher 3": 143.1},
  },
  "RTX 4060 8 GB": {
    "r1080": {"A Plague Tale: Requiem": 71.1, "Alan Wake 2": 50.6, "Assassin's Creed Mirage": 91.9, "Assassin's Creed Shadows": 31.3, "Atomic Heart": 52.6, "Avowed": 36.3, "Baldur's Gate 3": 97.1, "Battlefield V": 159.2, "Black Myth Wukong": 28.0, "Cities Skylines II": 23.0, "Counter-Strike 2": 219.7, "Cyberpunk 2077": 77.8, "DOOM Eternal": 133.6, "Dead Space": 71.7, "Dragon Age Veilguard": 50.3, "Elden Ring": 96.7, "F1 23": 93.2, "F1 24": 106.6, "Far Cry 6": 113.6, "Ghost of Tsushima": 72.2, "God of War": 74.7, "God of War Ragnarok": 66.1, "Hogwarts Legacy": 58.3, "Horizon: Forbidden West": 68.9, "Jedi Survivor": 64.3, "Kingdom Come 2": 72.9, "Lords of the Fallen": 41.9, "Monster Hunter Wilds": 32.9, "No Rest for the Wicked": 86.9, "Ratchet & Clank": 60.2, "Remnant II": 66.1, "Resident Evil 4": 68.4, "Spider-Man 2": 66.9, "Spider-Man Remastered": 123.6, "Stalker 2": 49.1, "Star Wars Outlaws": 43.5, "Starfield": 53.2, "The Last of Us Pt.1": 47.2, "The Witcher 3": 139.7},
    "r1440": {"A Plague Tale: Requiem": 49.9, "Alan Wake 2": 36.0, "Assassin's Creed Mirage": 68.8, "Assassin's Creed Shadows": 25.0, "Atomic Heart": 42.7, "Avowed": 24.1, "Baldur's Gate 3": 67.7, "Battlefield V": 122.0, "Black Myth Wukong": 20.8, "Cities Skylines II": 16.2, "Counter-Strike 2": 143.4, "Cyberpunk 2077": 44.1, "DOOM Eternal": 108.8, "Dead Space": 45.0, "Dragon Age Veilguard": 37.8, "Elden Ring": 71.5, "F1 23": 74.8, "F1 24": 85.7, "Far Cry 6": 79.3, "Ghost of Tsushima": 50.8, "God of War": 59.4, "God of War Ragnarok": 51.9, "Hogwarts Legacy": 40.6, "Horizon: Forbidden West": 50.9, "Jedi Survivor": 41.3, "Kingdom Come 2": 47.8, "Lords of the Fallen": 29.2, "Monster Hunter Wilds": 13.0, "No Rest for the Wicked": 53.1, "Ratchet & Clank": 45.8, "Remnant II": 47.0, "Resident Evil 4": 45.8, "Spider-Man 2": 44.5, "Spider-Man Remastered": 86.6, "Stalker 2": 33.9, "Star Wars Outlaws": 28.5, "Starfield": 40.5, "The Last of Us Pt.1": 37.4, "The Witcher 3": 101.8},
    "r4k": {"A Plague Tale: Requiem": 26.0, "Alan Wake 2": 17.9, "Assassin's Creed Mirage": 37.7, "Assassin's Creed Shadows": 16.1, "Atomic Heart": 28.2, "Avowed": 10.5, "Baldur's Gate 3": 35.0, "Battlefield V": 69.7, "Black Myth Wukong": 9.4, "Cities Skylines II": 6.3, "Counter-Strike 2": 71.2, "Cyberpunk 2077": 18.2, "DOOM Eternal": 59.7, "Dead Space": 22.4, "Dragon Age Veilguard": 21.0, "Elden Ring": 39.5, "F1 23": 47.4, "F1 24": 46.7, "Far Cry 6": 42.3, "Ghost of Tsushima": 27.9, "God of War": 38.0, "God of War Ragnarok": 31.0, "Hogwarts Legacy": 20.7, "Horizon: Forbidden West": 29.1, "Jedi Survivor": 20.6, "Kingdom Come 2": 24.7, "Lords of the Fallen": 14.8, "Monster Hunter Wilds": 11.7, "No Rest for the Wicked": 28.8, "Ratchet & Clank": 26.9, "Remnant II": 25.2, "Resident Evil 4": 26.7, "Spider-Man 2": 22.0, "Spider-Man Remastered": 47.4, "Stalker 2": 12.3, "Star Wars Outlaws": 10.6, "Starfield": 23.8, "The Last of Us Pt.1": 18.0, "The Witcher 3": 57.4},
  },
  "RTX 4060 Ti 16 GB": {
    "r1080": {"Alan Wake 2": 65.7, "Assassin's Creed Shadows": 38.9, "Avowed": 48.2, "Baldur's Gate 3": 126.5, "Black Myth Wukong": 36.3, "Counter-Strike 2": 256.6, "Cyberpunk 2077": 97.6, "DOOM Eternal": 171.1, "Dragon Age Veilguard": 66.7, "Elden Ring": 118.5, "F1 24": 143.9, "Ghost of Tsushima": 88.2, "God of War Ragnarok": 83.9, "Hogwarts Legacy": 70.5, "Horizon: Forbidden West": 83.9, "Kingdom Come 2": 92.5, "Monster Hunter Wilds": 45.6, "No Rest for the Wicked": 108.7, "Spider-Man 2": 95.5, "Stalker 2": 61.1, "Star Wars Outlaws": 58.9, "Starfield": 69.0, "The Last of Us Pt.1": 70.0, "The Witcher 3": 178.6},
    "r1440": {"Alan Wake 2": 47.1, "Assassin's Creed Shadows": 32.8, "Avowed": 32.5, "Baldur's Gate 3": 88.8, "Black Myth Wukong": 27.0, "Counter-Strike 2": 167.6, "Cyberpunk 2077": 58.4, "DOOM Eternal": 140.2, "Dragon Age Veilguard": 47.6, "Elden Ring": 85.5, "F1 24": 116.1, "Ghost of Tsushima": 60.8, "God of War Ragnarok": 66.3, "Hogwarts Legacy": 50.4, "Horizon: Forbidden West": 62.6, "Kingdom Come 2": 61.8, "Monster Hunter Wilds": 35.3, "No Rest for the Wicked": 70.2, "Spider-Man 2": 65.1, "Stalker 2": 42.4, "Star Wars Outlaws": 38.6, "Starfield": 53.0, "The Last of Us Pt.1": 49.8, "The Witcher 3": 129.8},
    "r4k": {"Alan Wake 2": 26.0, "Assassin's Creed Shadows": 21.0, "Avowed": 16.6, "Baldur's Gate 3": 45.8, "Black Myth Wukong": 15.7, "Counter-Strike 2": 82.5, "Cyberpunk 2077": 26.1, "DOOM Eternal": 86.7, "Dragon Age Veilguard": 27.0, "Elden Ring": 46.9, "F1 24": 70.5, "Ghost of Tsushima": 32.9, "God of War Ragnarok": 39.5, "Hogwarts Legacy": 26.0, "Horizon: Forbidden West": 35.9, "Kingdom Come 2": 31.7, "Monster Hunter Wilds": 21.4, "No Rest for the Wicked": 36.4, "Spider-Man 2": 33.8, "Stalker 2": 22.7, "Star Wars Outlaws": 13.1, "Starfield": 32.0, "The Last of Us Pt.1": 27.2, "The Witcher 3": 70.3},
  },
  "RTX 4060 Ti 8 GB": {
    "r1080": {"Alan Wake 2": 66.0, "Assassin's Creed Shadows": 40.1, "Avowed": 48.4, "Baldur's Gate 3": 124.0, "Black Myth Wukong": 36.3, "Counter-Strike 2": 257.5, "Cyberpunk 2077": 98.2, "DOOM Eternal": 170.0, "Dragon Age Veilguard": 66.7, "Elden Ring": 118.5, "F1 24": 144.9, "Ghost of Tsushima": 88.7, "God of War Ragnarok": 83.2, "Hogwarts Legacy": 71.1, "Horizon: Forbidden West": 83.9, "Kingdom Come 2": 91.7, "Monster Hunter Wilds": 45.0, "No Rest for the Wicked": 112.1, "Spider-Man 2": 82.4, "Stalker 2": 60.7, "Star Wars Outlaws": 59.0, "Starfield": 68.8, "The Last of Us Pt.1": 57.0, "The Witcher 3": 177.8},
    "r1440": {"Alan Wake 2": 47.3, "Assassin's Creed Shadows": 33.1, "Avowed": 32.8, "Baldur's Gate 3": 87.7, "Black Myth Wukong": 27.2, "Counter-Strike 2": 168.0, "Cyberpunk 2077": 58.1, "DOOM Eternal": 140.1, "Dragon Age Veilguard": 47.8, "Elden Ring": 85.8, "F1 24": 114.8, "Ghost of Tsushima": 61.2, "God of War Ragnarok": 66.5, "Hogwarts Legacy": 51.7, "Horizon: Forbidden West": 63.1, "Kingdom Come 2": 62.3, "Monster Hunter Wilds": 36.1, "No Rest for the Wicked": 68.0, "Spider-Man 2": 56.2, "Stalker 2": 42.5, "Star Wars Outlaws": 39.1, "Starfield": 53.2, "The Last of Us Pt.1": 47.0, "The Witcher 3": 129.1},
    "r4k": {"Alan Wake 2": 24.7, "Assassin's Creed Shadows": 21.2, "Avowed": 13.4, "Baldur's Gate 3": 45.9, "Black Myth Wukong": 13.0, "Counter-Strike 2": 83.8, "Cyberpunk 2077": 25.7, "DOOM Eternal": 72.8, "Dragon Age Veilguard": 25.8, "Elden Ring": 46.8, "F1 24": 56.8, "Ghost of Tsushima": 33.4, "God of War Ragnarok": 38.4, "Hogwarts Legacy": 27.8, "Horizon: Forbidden West": 36.2, "Kingdom Come 2": 32.1, "Monster Hunter Wilds": 12.4, "No Rest for the Wicked": 36.8, "Spider-Man 2": 27.2, "Stalker 2": 15.6, "Star Wars Outlaws": 13.6, "Starfield": 32.1, "The Last of Us Pt.1": 21.7, "The Witcher 3": 70.5},
  },
  "RTX 4070 12 GB": {
    "r1080": {"Alan Wake 2": 86.8, "Assassin's Creed Shadows": 53.7, "Avowed": 61.4, "Baldur's Gate 3": 165.1, "Black Myth Wukong": 45.4, "Counter-Strike 2": 342.2, "Cyberpunk 2077": 119.4, "DOOM Eternal": 218.7, "Dragon Age Veilguard": 86.2, "Elden Ring": 155.7, "F1 24": 188.0, "Ghost of Tsushima": 114.3, "God of War Ragnarok": 110.7, "Hogwarts Legacy": 89.8, "Horizon: Forbidden West": 107.7, "Kingdom Come 2": 117.0, "Monster Hunter Wilds": 59.2, "No Rest for the Wicked": 142.7, "Spider-Man 2": 113.0, "Stalker 2": 77.4, "Star Wars Outlaws": 76.6, "Starfield": 88.9, "The Last of Us Pt.1": 92.1, "The Witcher 3": 229.7},
    "r1440": {"Alan Wake 2": 62.8, "Assassin's Creed Shadows": 43.5, "Avowed": 41.6, "Baldur's Gate 3": 117.2, "Black Myth Wukong": 35.0, "Counter-Strike 2": 227.9, "Cyberpunk 2077": 70.5, "DOOM Eternal": 180.2, "Dragon Age Veilguard": 66.0, "Elden Ring": 117.9, "F1 24": 154.6, "Ghost of Tsushima": 83.9, "God of War Ragnarok": 86.6, "Hogwarts Legacy": 63.5, "Horizon: Forbidden West": 83.6, "Kingdom Come 2": 81.0, "Monster Hunter Wilds": 46.8, "No Rest for the Wicked": 87.8, "Spider-Man 2": 86.3, "Stalker 2": 56.7, "Star Wars Outlaws": 50.4, "Starfield": 70.3, "The Last of Us Pt.1": 67.2, "The Witcher 3": 172.2},
    "r4k": {"Alan Wake 2": 34.5, "Assassin's Creed Shadows": 28.1, "Avowed": 21.7, "Baldur's Gate 3": 63.3, "Black Myth Wukong": 20.9, "Counter-Strike 2": 112.5, "Cyberpunk 2077": 29.7, "DOOM Eternal": 113.9, "Dragon Age Veilguard": 38.8, "Elden Ring": 66.9, "F1 24": 98.0, "Ghost of Tsushima": 47.6, "God of War Ragnarok": 54.6, "Hogwarts Legacy": 36.5, "Horizon: Forbidden West": 50.4, "Kingdom Come 2": 42.6, "Monster Hunter Wilds": 29.4, "No Rest for the Wicked": 50.5, "Spider-Man 2": 46.3, "Stalker 2": 31.1, "Star Wars Outlaws": 18.6, "Starfield": 43.0, "The Last of Us Pt.1": 38.5, "The Witcher 3": 99.3},
  },
  "RTX 4070 Super 12 GB": {
    "r1080": {"Alan Wake 2": 96.8, "Assassin's Creed Shadows": 59.1, "Avowed": 69.6, "Baldur's Gate 3": 184.1, "Black Myth Wukong": 52.9, "Counter-Strike 2": 395.8, "Cyberpunk 2077": 145.5, "DOOM Eternal": 245.2, "Dragon Age Veilguard": 97.3, "Elden Ring": 166.5, "F1 24": 209.7, "Ghost of Tsushima": 128.2, "God of War Ragnarok": 125.7, "Hogwarts Legacy": 108.0, "Horizon: Forbidden West": 120.4, "Kingdom Come 2": 130.3, "Monster Hunter Wilds": 65.5, "No Rest for the Wicked": 170.7, "Spider-Man 2": 115.6, "Stalker 2": 85.2, "Star Wars Outlaws": 88.5, "Starfield": 100.7, "The Last of Us Pt.1": 103.6, "The Witcher 3": 269.8},
    "r1440": {"Alan Wake 2": 70.7, "Assassin's Creed Shadows": 49.0, "Avowed": 48.7, "Baldur's Gate 3": 134.6, "Black Myth Wukong": 40.9, "Counter-Strike 2": 265.6, "Cyberpunk 2077": 90.5, "DOOM Eternal": 201.1, "Dragon Age Veilguard": 75.0, "Elden Ring": 129.3, "F1 24": 174.7, "Ghost of Tsushima": 94.7, "God of War Ragnarok": 100.5, "Hogwarts Legacy": 76.9, "Horizon: Forbidden West": 92.7, "Kingdom Come 2": 92.9, "Monster Hunter Wilds": 52.1, "No Rest for the Wicked": 106.0, "Spider-Man 2": 87.3, "Stalker 2": 62.7, "Star Wars Outlaws": 59.0, "Starfield": 79.1, "The Last of Us Pt.1": 76.3, "The Witcher 3": 203.2},
    "r4k": {"Alan Wake 2": 40.4, "Assassin's Creed Shadows": 32.3, "Avowed": 25.7, "Baldur's Gate 3": 74.9, "Black Myth Wukong": 23.8, "Counter-Strike 2": 130.7, "Cyberpunk 2077": 41.0, "DOOM Eternal": 131.1, "Dragon Age Veilguard": 43.5, "Elden Ring": 75.0, "F1 24": 112.2, "Ghost of Tsushima": 52.8, "God of War Ragnarok": 61.8, "Hogwarts Legacy": 42.9, "Horizon: Forbidden West": 56.0, "Kingdom Come 2": 48.8, "Monster Hunter Wilds": 32.9, "No Rest for the Wicked": 57.4, "Spider-Man 2": 50.4, "Stalker 2": 35.4, "Star Wars Outlaws": 26.5, "Starfield": 49.2, "The Last of Us Pt.1": 42.8, "The Witcher 3": 114.9},
  },
  "RTX 4070 Ti 12 GB": {
    "r1080": {"Alan Wake 2": 104.4, "Assassin's Creed Shadows": 63.9, "Avowed": 75.4, "Baldur's Gate 3": 187.0, "Black Myth Wukong": 57.7, "Counter-Strike 2": 416.8, "Cyberpunk 2077": 159.4, "DOOM Eternal": 262.7, "Dragon Age Veilguard": 106.4, "Elden Ring": 174.7, "F1 24": 232.3, "Ghost of Tsushima": 134.8, "God of War Ragnarok": 132.8, "Hogwarts Legacy": 116.4, "Horizon: Forbidden West": 127.8, "Kingdom Come 2": 138.2, "Monster Hunter Wilds": 68.5, "No Rest for the Wicked": 179.1, "Spider-Man 2": 122.3, "Stalker 2": 91.4, "Star Wars Outlaws": 97.3, "Starfield": 108.3, "The Last of Us Pt.1": 109.9, "The Witcher 3": 293.2},
    "r1440": {"Alan Wake 2": 77.4, "Assassin's Creed Shadows": 53.9, "Avowed": 53.4, "Baldur's Gate 3": 141.7, "Black Myth Wukong": 44.8, "Counter-Strike 2": 272.8, "Cyberpunk 2077": 97.5, "DOOM Eternal": 219.4, "Dragon Age Veilguard": 82.8, "Elden Ring": 136.2, "F1 24": 192.0, "Ghost of Tsushima": 99.7, "God of War Ragnarok": 105.6, "Hogwarts Legacy": 83.0, "Horizon: Forbidden West": 98.8, "Kingdom Come 2": 101.0, "Monster Hunter Wilds": 55.8, "No Rest for the Wicked": 116.5, "Spider-Man 2": 93.1, "Stalker 2": 66.8, "Star Wars Outlaws": 65.4, "Starfield": 86.3, "The Last of Us Pt.1": 81.0, "The Witcher 3": 221.9},
    "r4k": {"Alan Wake 2": 44.3, "Assassin's Creed Shadows": 35.8, "Avowed": 28.3, "Baldur's Gate 3": 78.3, "Black Myth Wukong": 26.3, "Counter-Strike 2": 136.6, "Cyberpunk 2077": 45.6, "DOOM Eternal": 143.6, "Dragon Age Veilguard": 47.4, "Elden Ring": 79.2, "F1 24": 123.2, "Ghost of Tsushima": 55.4, "God of War Ragnarok": 67.0, "Hogwarts Legacy": 45.5, "Horizon: Forbidden West": 60.2, "Kingdom Come 2": 53.7, "Monster Hunter Wilds": 35.1, "No Rest for the Wicked": 63.8, "Spider-Man 2": 54.0, "Stalker 2": 38.0, "Star Wars Outlaws": 30.0, "Starfield": 54.2, "The Last of Us Pt.1": 46.0, "The Witcher 3": 124.0},
  },
  "RTX 4070 Ti Super 16 GB": {
    "r1080": {"Alan Wake 2": 113.8, "Assassin's Creed Mirage": 161.0, "Assassin's Creed Shadows": 68.7, "Avowed": 79.5, "Baldur's Gate 3": 190.1, "Black Myth Wukong": 66.9, "Counter-Strike 2": 453.5, "Cyberpunk 2077": 166.3, "DOOM Eternal": 276.3, "Dragon Age Veilguard": 111.4, "Elden Ring": 191.4, "F1 24": 213.2, "Ghost of Tsushima": 143.5, "God of War Ragnarok": 145.2, "Hogwarts Legacy": 113.7, "Horizon: Forbidden West": 134.7, "Kingdom Come 2": 151.4, "Monster Hunter Wilds": 72.0, "No Rest for the Wicked": 188.5, "Resident Evil 4": 159.1, "Spider-Man 2": 158.4, "Stalker 2": 98.0, "Star Wars Outlaws": 102.2, "Starfield": 114.6, "The Last of Us Pt.1": 117.4, "The Witcher 3": 305.8},
    "r1440": {"Alan Wake 2": 84.0, "Assassin's Creed Mirage": 129.5, "Assassin's Creed Shadows": 56.5, "Avowed": 56.3, "Baldur's Gate 3": 161.2, "Black Myth Wukong": 47.4, "Counter-Strike 2": 311.4, "Cyberpunk 2077": 102.9, "DOOM Eternal": 232.1, "Dragon Age Veilguard": 87.4, "Elden Ring": 154.7, "F1 24": 182.7, "Ghost of Tsushima": 110.5, "God of War Ragnarok": 117.7, "Hogwarts Legacy": 83.1, "Horizon: Forbidden West": 107.2, "Kingdom Come 2": 109.2, "Monster Hunter Wilds": 60.4, "No Rest for the Wicked": 119.6, "Resident Evil 4": 117.1, "Spider-Man 2": 115.0, "Stalker 2": 75.2, "Star Wars Outlaws": 69.0, "Starfield": 92.3, "The Last of Us Pt.1": 88.8, "The Witcher 3": 236.8},
    "r4k": {"Alan Wake 2": 48.3, "Assassin's Creed Mirage": 83.6, "Assassin's Creed Shadows": 36.4, "Avowed": 30.2, "Baldur's Gate 3": 88.4, "Black Myth Wukong": 28.4, "Counter-Strike 2": 154.3, "Cyberpunk 2077": 47.3, "DOOM Eternal": 151.7, "Dragon Age Veilguard": 52.4, "Elden Ring": 91.6, "F1 24": 125.1, "Ghost of Tsushima": 63.0, "God of War Ragnarok": 72.9, "Hogwarts Legacy": 46.1, "Horizon: Forbidden West": 66.7, "Kingdom Come 2": 57.8, "Monster Hunter Wilds": 38.3, "No Rest for the Wicked": 65.5, "Resident Evil 4": 68.6, "Spider-Man 2": 63.5, "Stalker 2": 43.3, "Star Wars Outlaws": 31.7, "Starfield": 59.2, "The Last of Us Pt.1": 51.4, "The Witcher 3": 138.1},
  },
  "RTX 4080 16 GB": {
    "r1080": {"Alan Wake 2": 129.3, "Assassin's Creed Mirage": 175.9, "Assassin's Creed Shadows": 77.6, "Avowed": 90.6, "Baldur's Gate 3": 207.8, "Black Myth Wukong": 71.2, "Counter-Strike 2": 498.4, "Cyberpunk 2077": 194.5, "DOOM Eternal": 305.1, "Dragon Age Veilguard": 129.0, "Elden Ring": 197.7, "F1 24": 245.2, "Ghost of Tsushima": 159.9, "God of War Ragnarok": 167.8, "Hogwarts Legacy": 132.9, "Horizon: Forbidden West": 152.0, "Kingdom Come 2": 170.1, "Monster Hunter Wilds": 78.3, "No Rest for the Wicked": 219.2, "Resident Evil 4": 181.6, "Spider-Man 2": 177.6, "Stalker 2": 106.7, "Star Wars Outlaws": 117.9, "Starfield": 130.2, "The Last of Us Pt.1": 131.9, "The Witcher 3": 357.2},
    "r1440": {"Alan Wake 2": 96.6, "Assassin's Creed Mirage": 142.7, "Assassin's Creed Shadows": 65.3, "Avowed": 64.6, "Baldur's Gate 3": 184.9, "Black Myth Wukong": 54.8, "Counter-Strike 2": 349.4, "Cyberpunk 2077": 123.0, "DOOM Eternal": 261.6, "Dragon Age Veilguard": 101.3, "Elden Ring": 176.1, "F1 24": 208.1, "Ghost of Tsushima": 125.1, "God of War Ragnarok": 133.9, "Hogwarts Legacy": 98.0, "Horizon: Forbidden West": 121.5, "Kingdom Come 2": 126.8, "Monster Hunter Wilds": 65.9, "No Rest for the Wicked": 141.1, "Resident Evil 4": 133.6, "Spider-Man 2": 132.6, "Stalker 2": 82.0, "Star Wars Outlaws": 80.6, "Starfield": 104.5, "The Last of Us Pt.1": 100.2, "The Witcher 3": 283.8},
    "r4k": {"Alan Wake 2": 55.8, "Assassin's Creed Mirage": 94.0, "Assassin's Creed Shadows": 42.7, "Avowed": 35.5, "Baldur's Gate 3": 105.7, "Black Myth Wukong": 33.5, "Counter-Strike 2": 176.7, "Cyberpunk 2077": 59.2, "DOOM Eternal": 174.6, "Dragon Age Veilguard": 61.1, "Elden Ring": 105.0, "F1 24": 144.2, "Ghost of Tsushima": 71.4, "God of War Ragnarok": 85.6, "Hogwarts Legacy": 53.8, "Horizon: Forbidden West": 76.4, "Kingdom Come 2": 69.0, "Monster Hunter Wilds": 43.5, "No Rest for the Wicked": 80.2, "Resident Evil 4": 80.1, "Spider-Man 2": 73.8, "Stalker 2": 49.2, "Star Wars Outlaws": 43.0, "Starfield": 68.3, "The Last of Us Pt.1": 58.6, "The Witcher 3": 164.1},
  },
  "RTX 4080 Super 16 GB": {
    "r1080": {"Alan Wake 2": 130.4, "Assassin's Creed Mirage": 176.4, "Baldur's Gate 3": 207.5, "Black Myth Wukong": 71.4, "Counter-Strike 2": 523.8, "Cyberpunk 2077": 194.8, "DOOM Eternal": 310.3, "Dragon Age Veilguard": 129.7, "Elden Ring": 199.6, "F1 24": 246.1, "God of War Ragnarok": 170.2, "Hogwarts Legacy": 133.4, "Horizon: Forbidden West": 152.6, "No Rest for the Wicked": 220.1, "Resident Evil 4": 184.9, "Stalker 2": 110.8, "Star Wars Outlaws": 118.4, "Starfield": 131.5, "The Last of Us Pt.1": 133.8, "The Witcher 3": 363.8},
    "r1440": {"Alan Wake 2": 97.5, "Assassin's Creed Mirage": 145.4, "Baldur's Gate 3": 185.5, "Black Myth Wukong": 55.1, "Counter-Strike 2": 360.1, "Cyberpunk 2077": 123.1, "Dragon Age Veilguard": 103.2, "Elden Ring": 178.2, "F1 24": 213.6, "Ghost of Tsushima": 125.5, "Hogwarts Legacy": 98.5, "Horizon: Forbidden West": 123.9, "No Rest for the Wicked": 143.9, "Resident Evil 4": 137.7, "Stalker 2": 84.7, "Star Wars Outlaws": 81.8, "Starfield": 105.0, "The Last of Us Pt.1": 101.3, "The Witcher 3": 287.8},
    "r4k": {"Alan Wake 2": 56.5, "Assassin's Creed Mirage": 94.9, "Baldur's Gate 3": 107.6, "Black Myth Wukong": 34.1, "Counter-Strike 2": 182.8, "Cyberpunk 2077": 59.4, "DOOM Eternal": 177.5, "Elden Ring": 107.2, "F1 24": 146.4, "God of War Ragnarok": 85.8, "Hogwarts Legacy": 53.8, "Horizon: Forbidden West": 77.1, "No Rest for the Wicked": 80.3, "Resident Evil 4": 83.3, "Stalker 2": 50.7, "Star Wars Outlaws": 43.5, "Starfield": 69.1, "The Last of Us Pt.1": 59.8, "The Witcher 3": 167.2},
  },
  "RTX 4090 24 GB": {
    "r1080": {"Alan Wake 2": 160.8, "Assassin's Creed Mirage": 196.0, "Baldur's Gate 3": 208.6, "Black Myth Wukong": 86.4, "Counter-Strike 2": 623.2, "Cyberpunk 2077": 231.4, "DOOM Eternal": 364.6, "Dragon Age Veilguard": 159.9, "Elden Ring": 201.6, "F1 24": 299.6, "God of War Ragnarok": 203.2, "Hogwarts Legacy": 154.6, "Horizon: Forbidden West": 175.7, "No Rest for the Wicked": 273.2, "Resident Evil 4": 235.1, "Stalker 2": 122.4, "Star Wars Outlaws": 152.6, "Starfield": 157.0, "The Last of Us Pt.1": 161.4, "The Witcher 3": 442.1},
    "r1440": {"Alan Wake 2": 121.0, "Assassin's Creed Mirage": 161.0, "Baldur's Gate 3": 206.7, "Black Myth Wukong": 67.5, "Counter-Strike 2": 451.2, "Cyberpunk 2077": 155.0, "Dragon Age Veilguard": 128.5, "Elden Ring": 197.1, "F1 24": 261.5, "Ghost of Tsushima": 151.3, "Hogwarts Legacy": 117.3, "Horizon: Forbidden West": 148.5, "No Rest for the Wicked": 185.2, "Resident Evil 4": 179.0, "Stalker 2": 96.5, "Star Wars Outlaws": 107.9, "Starfield": 129.5, "The Last of Us Pt.1": 122.9, "The Witcher 3": 361.6},
    "r4k": {"Alan Wake 2": 71.5, "Assassin's Creed Mirage": 114.1, "Baldur's Gate 3": 140.2, "Black Myth Wukong": 43.0, "Counter-Strike 2": 228.8, "Cyberpunk 2077": 74.3, "DOOM Eternal": 219.0, "Elden Ring": 134.1, "F1 24": 188.4, "God of War Ragnarok": 112.9, "Hogwarts Legacy": 68.6, "Horizon: Forbidden West": 97.0, "No Rest for the Wicked": 107.0, "Resident Evil 4": 112.5, "Stalker 2": 61.0, "Star Wars Outlaws": 59.6, "Starfield": 88.0, "The Last of Us Pt.1": 76.0, "The Witcher 3": 213.8},
  },
  "RTX 5050 Gaming 8 GB": {
    "r1080": {"Alan Wake 2": 50.4, "Assassin's Creed Shadows": 31.1, "Avowed": 34.9, "Baldur's Gate 3": 96.9, "Black Myth Wukong": 28.0, "Counter-Strike 2": 211.8, "Cyberpunk 2077": 77.5, "DOOM Eternal": 124.5, "Dragon Age Veilguard": 50.1, "Elden Ring": 104.7, "F1 24": 93.4, "Ghost of Tsushima": 61.5, "God of War Ragnarok": 63.0, "Hogwarts Legacy": 57.7, "Horizon: Forbidden West": 66.5, "Kingdom Come 2": 72.4, "Monster Hunter Wilds": 31.9, "No Rest for the Wicked": 89.8, "Spider-Man 2": 65.5, "Stalker 2": 49.1, "Star Wars Outlaws": 39.3, "Starfield": 50.6, "The Last of Us Pt.1": 49.1, "The Witcher 3": 133.9},
    "r1440": {"Alan Wake 2": 35.6, "Assassin's Creed Shadows": 23.0, "Avowed": 23.4, "Baldur's Gate 3": 66.7, "Black Myth Wukong": 20.7, "Counter-Strike 2": 138.0, "Cyberpunk 2077": 47.2, "DOOM Eternal": 81.1, "Dragon Age Veilguard": 36.8, "Elden Ring": 74.9, "F1 24": 77.8, "Ghost of Tsushima": 38.4, "God of War Ragnarok": 50.4, "Hogwarts Legacy": 39.8, "Horizon: Forbidden West": 48.5, "Kingdom Come 2": 47.0, "Monster Hunter Wilds": 25.6, "No Rest for the Wicked": 53.0, "Spider-Man 2": 42.5, "Stalker 2": 33.9, "Star Wars Outlaws": 25.9, "Starfield": 38.4, "The Last of Us Pt.1": 27.5, "The Witcher 3": 98.3},
    "r4k": {"Alan Wake 2": 18.6, "Assassin's Creed Shadows": 15.2, "Avowed": 8.1, "Baldur's Gate 3": 34.9, "Black Myth Wukong": 8.6, "Counter-Strike 2": 70.4, "Cyberpunk 2077": 21.1, "DOOM Eternal": 53.0, "Dragon Age Veilguard": 20.1, "Elden Ring": 41.3, "F1 24": 37.2, "Ghost of Tsushima": 24.0, "God of War Ragnarok": 28.6, "Hogwarts Legacy": 22.1, "Horizon: Forbidden West": 28.1, "Kingdom Come 2": 24.2, "Monster Hunter Wilds": 12.3, "No Rest for the Wicked": 28.3, "Spider-Man 2": 18.9, "Stalker 2": 8.4, "Star Wars Outlaws": 12.9, "Starfield": 23.4, "The Last of Us Pt.1": 15.7, "The Witcher 3": 55.9},
  },
  "RTX 5060 8 GB": {
    "r1080": {"Alan Wake 2": 66.1, "Assassin's Creed Shadows": 37.4, "Avowed": 45.0, "Baldur's Gate 3": 121.1, "Black Myth Wukong": 35.5, "Counter-Strike 2": 279.0, "Cyberpunk 2077": 102.2, "DOOM Eternal": 157.6, "Dragon Age Veilguard": 65.0, "Elden Ring": 140.1, "F1 24": 133.3, "Ghost of Tsushima": 80.8, "God of War Ragnarok": 85.2, "Hogwarts Legacy": 73.7, "Horizon: Forbidden West": 83.5, "Kingdom Come 2": 94.9, "Monster Hunter Wilds": 42.9, "No Rest for the Wicked": 117.6, "Spider-Man 2": 81.5, "Stalker 2": 61.5, "Star Wars Outlaws": 52.7, "Starfield": 65.5, "The Last of Us Pt.1": 57.7, "The Witcher 3": 177.3},
    "r1440": {"Alan Wake 2": 47.1, "Assassin's Creed Shadows": 30.8, "Avowed": 30.9, "Baldur's Gate 3": 87.9, "Black Myth Wukong": 27.1, "Counter-Strike 2": 188.8, "Cyberpunk 2077": 62.1, "DOOM Eternal": 107.0, "Dragon Age Veilguard": 49.6, "Elden Ring": 98.1, "F1 24": 97.3, "Ghost of Tsushima": 57.8, "God of War Ragnarok": 66.3, "Hogwarts Legacy": 51.1, "Horizon: Forbidden West": 62.5, "Kingdom Come 2": 63.2, "Monster Hunter Wilds": 30.0, "No Rest for the Wicked": 71.3, "Spider-Man 2": 51.8, "Stalker 2": 43.8, "Star Wars Outlaws": 34.3, "Starfield": 50.6, "The Last of Us Pt.1": 33.1, "The Witcher 3": 131.5},
    "r4k": {"Alan Wake 2": 25.2, "Assassin's Creed Shadows": 19.9, "Avowed": 9.3, "Baldur's Gate 3": 46.3, "Black Myth Wukong": 9.4, "Counter-Strike 2": 97.5, "Cyberpunk 2077": 28.1, "DOOM Eternal": 67.0, "Dragon Age Veilguard": 24.5, "Elden Ring": 56.2, "F1 24": 44.6, "Ghost of Tsushima": 32.3, "God of War Ragnarok": 38.8, "Hogwarts Legacy": 29.6, "Horizon: Forbidden West": 37.1, "Kingdom Come 2": 31.8, "Monster Hunter Wilds": 12.8, "No Rest for the Wicked": 37.7, "Spider-Man 2": 21.2, "Stalker 2": 4.0, "Star Wars Outlaws": 17.6, "Starfield": 30.9, "The Last of Us Pt.1": 10.2, "The Witcher 3": 74.8},
  },
  "RTX 5060 Ti 16 GB": {
    "r1080": {"Alan Wake 2": 75.0, "Assassin's Creed Shadows": 42.8, "Avowed": 53.5, "Baldur's Gate 3": 136.7, "Black Myth Wukong": 42.3, "Counter-Strike 2": 303.7, "Cyberpunk 2077": 114.1, "DOOM Eternal": 175.4, "Dragon Age Veilguard": 72.9, "Elden Ring": 146.7, "F1 24": 151.9, "Ghost of Tsushima": 92.1, "God of War Ragnarok": 96.4, "Hogwarts Legacy": 84.6, "Horizon: Forbidden West": 90.8, "Kingdom Come 2": 104.2, "Monster Hunter Wilds": 49.9, "No Rest for the Wicked": 130.0, "Spider-Man 2": 104.1, "Stalker 2": 69.1, "Star Wars Outlaws": 62.0, "Starfield": 73.6, "The Last of Us Pt.1": 77.7, "The Witcher 3": 200.3},
    "r1440": {"Alan Wake 2": 54.1, "Assassin's Creed Shadows": 33.9, "Avowed": 37.3, "Baldur's Gate 3": 100.0, "Black Myth Wukong": 32.4, "Counter-Strike 2": 204.1, "Cyberpunk 2077": 76.8, "DOOM Eternal": 144.8, "Dragon Age Veilguard": 56.6, "Elden Ring": 109.5, "F1 24": 122.7, "Ghost of Tsushima": 68.1, "God of War Ragnarok": 75.4, "Hogwarts Legacy": 60.5, "Horizon: Forbidden West": 69.1, "Kingdom Come 2": 71.8, "Monster Hunter Wilds": 39.1, "No Rest for the Wicked": 81.7, "Spider-Man 2": 73.0, "Stalker 2": 49.6, "Star Wars Outlaws": 40.9, "Starfield": 57.8, "The Last of Us Pt.1": 56.1, "The Witcher 3": 151.1},
    "r4k": {"Alan Wake 2": 30.5, "Assassin's Creed Shadows": 23.1, "Avowed": 19.8, "Baldur's Gate 3": 52.8, "Black Myth Wukong": 19.0, "Counter-Strike 2": 106.8, "Cyberpunk 2077": 35.1, "DOOM Eternal": 91.6, "Dragon Age Veilguard": 34.3, "Elden Ring": 61.7, "F1 24": 78.3, "Ghost of Tsushima": 37.0, "God of War Ragnarok": 47.0, "Hogwarts Legacy": 33.6, "Horizon: Forbidden West": 41.8, "Kingdom Come 2": 37.6, "Monster Hunter Wilds": 24.7, "No Rest for the Wicked": 45.0, "Spider-Man 2": 38.9, "Stalker 2": 27.8, "Star Wars Outlaws": 21.1, "Starfield": 35.4, "The Last of Us Pt.1": 32.0, "The Witcher 3": 86.1},
  },
  "RTX 5060 Ti 8 GB": {
    "r1080": {"Alan Wake 2": 76.7, "Assassin's Creed Shadows": 42.3, "Avowed": 54.5, "Baldur's Gate 3": 141.7, "Black Myth Wukong": 43.1, "Counter-Strike 2": 310.9, "Cyberpunk 2077": 116.7, "DOOM Eternal": 179.1, "Dragon Age Veilguard": 75.8, "Elden Ring": 149.8, "F1 24": 156.1, "Ghost of Tsushima": 93.7, "God of War Ragnarok": 96.3, "Hogwarts Legacy": 84.0, "Horizon: Forbidden West": 95.1, "Kingdom Come 2": 107.5, "Monster Hunter Wilds": 45.7, "No Rest for the Wicked": 135.5, "Spider-Man 2": 94.6, "Stalker 2": 70.4, "Star Wars Outlaws": 63.2, "Starfield": 74.4, "The Last of Us Pt.1": 68.7, "The Witcher 3": 205.5},
    "r1440": {"Alan Wake 2": 54.8, "Assassin's Creed Shadows": 35.1, "Avowed": 37.9, "Baldur's Gate 3": 103.6, "Black Myth Wukong": 32.8, "Counter-Strike 2": 205.2, "Cyberpunk 2077": 77.2, "DOOM Eternal": 112.2, "Dragon Age Veilguard": 55.9, "Elden Ring": 110.9, "F1 24": 124.7, "Ghost of Tsushima": 66.9, "God of War Ragnarok": 76.5, "Hogwarts Legacy": 61.3, "Horizon: Forbidden West": 71.9, "Kingdom Come 2": 73.5, "Monster Hunter Wilds": 35.4, "No Rest for the Wicked": 83.4, "Spider-Man 2": 56.6, "Stalker 2": 49.4, "Star Wars Outlaws": 42.1, "Starfield": 58.5, "The Last of Us Pt.1": 39.3, "The Witcher 3": 154.5},
    "r4k": {"Alan Wake 2": 29.1, "Assassin's Creed Shadows": 23.6, "Avowed": 16.7, "Baldur's Gate 3": 53.5, "Black Myth Wukong": 9.7, "Counter-Strike 2": 107.7, "Cyberpunk 2077": 35.3, "DOOM Eternal": 73.3, "Dragon Age Veilguard": 27.9, "Elden Ring": 62.1, "F1 24": 52.0, "Ghost of Tsushima": 37.2, "God of War Ragnarok": 41.5, "Hogwarts Legacy": 33.3, "Horizon: Forbidden West": 42.4, "Kingdom Come 2": 38.3, "Monster Hunter Wilds": 21.6, "No Rest for the Wicked": 45.2, "Spider-Man 2": 23.6, "Stalker 2": 7.4, "Star Wars Outlaws": 21.9, "Starfield": 36.7, "The Last of Us Pt.1": 9.6, "The Witcher 3": 87.6},
  },
  "RTX 5070 12 GB": {
    "r1080": {"Alan Wake 2": 100.0, "Assassin's Creed Mirage": 148.7, "Assassin's Creed Shadows": 61.2, "Avowed": 68.2, "Baldur's Gate 3": 189.3, "Black Myth Wukong": 61.5, "Counter-Strike 2": 429.8, "Cyberpunk 2077": 157.5, "DOOM Eternal": 234.4, "Dragon Age Veilguard": 103.8, "Elden Ring": 185.2, "F1 24": 193.3, "Ghost of Tsushima": 131.6, "God of War Ragnarok": 130.5, "Hogwarts Legacy": 111.2, "Horizon: Forbidden West": 127.1, "Kingdom Come 2": 143.9, "Monster Hunter Wilds": 65.2, "No Rest for the Wicked": 179.3, "Resident Evil 4": 150.3, "Spider-Man 2": 133.8, "Stalker 2": 92.7, "Star Wars Outlaws": 85.2, "Starfield": 102.1, "The Last of Us Pt.1": 106.5, "The Witcher 3": 289.9},
    "r1440": {"Alan Wake 2": 72.6, "Assassin's Creed Mirage": 116.3, "Assassin's Creed Shadows": 47.6, "Avowed": 48.6, "Baldur's Gate 3": 141.5, "Black Myth Wukong": 42.7, "Counter-Strike 2": 294.5, "Cyberpunk 2077": 104.4, "DOOM Eternal": 193.8, "Dragon Age Veilguard": 84.0, "Elden Ring": 151.6, "F1 24": 163.7, "Ghost of Tsushima": 92.3, "God of War Ragnarok": 106.3, "Hogwarts Legacy": 79.5, "Horizon: Forbidden West": 98.0, "Kingdom Come 2": 101.6, "Monster Hunter Wilds": 52.8, "No Rest for the Wicked": 114.7, "Resident Evil 4": 107.7, "Spider-Man 2": 96.2, "Stalker 2": 71.3, "Star Wars Outlaws": 57.2, "Starfield": 81.0, "The Last of Us Pt.1": 78.9, "The Witcher 3": 223.5},
    "r4k": {"Alan Wake 2": 41.4, "Assassin's Creed Mirage": 74.2, "Assassin's Creed Shadows": 33.3, "Avowed": 26.4, "Baldur's Gate 3": 78.7, "Black Myth Wukong": 25.7, "Counter-Strike 2": 156.9, "Cyberpunk 2077": 48.8, "DOOM Eternal": 125.1, "Dragon Age Veilguard": 51.0, "Elden Ring": 87.1, "F1 24": 115.0, "Ghost of Tsushima": 53.9, "God of War Ragnarok": 67.1, "Hogwarts Legacy": 44.6, "Horizon: Forbidden West": 59.0, "Kingdom Come 2": 53.9, "Monster Hunter Wilds": 34.2, "No Rest for the Wicked": 62.0, "Resident Evil 4": 62.3, "Spider-Man 2": 52.9, "Stalker 2": 41.2, "Star Wars Outlaws": 29.2, "Starfield": 51.8, "The Last of Us Pt.1": 44.3, "The Witcher 3": 127.2},
  },
  "RTX 5070 Ti 16 GB": {
    "r1080": {"Alan Wake 2": 125.6, "Assassin's Creed Mirage": 165.3, "Assassin's Creed Shadows": 72.3, "Avowed": 83.7, "Baldur's Gate 3": 202.8, "Black Myth Wukong": 75.2, "Counter-Strike 2": 505.3, "Cyberpunk 2077": 189.0, "DOOM Eternal": 280.0, "Dragon Age Veilguard": 125.4, "Elden Ring": 193.8, "F1 24": 230.3, "Ghost of Tsushima": 160.0, "God of War Ragnarok": 160.4, "Hogwarts Legacy": 128.3, "Horizon: Forbidden West": 146.3, "Kingdom Come 2": 169.7, "Monster Hunter Wilds": 76.7, "No Rest for the Wicked": 220.4, "Resident Evil 4": 189.4, "Spider-Man 2": 169.8, "Stalker 2": 108.2, "Star Wars Outlaws": 109.5, "Starfield": 123.2, "The Last of Us Pt.1": 131.6, "The Witcher 3": 344.8},
    "r1440": {"Alan Wake 2": 93.0, "Assassin's Creed Mirage": 136.4, "Assassin's Creed Shadows": 62.6, "Avowed": 61.4, "Baldur's Gate 3": 168.8, "Black Myth Wukong": 53.3, "Counter-Strike 2": 360.3, "Cyberpunk 2077": 125.2, "DOOM Eternal": 236.9, "Dragon Age Veilguard": 102.6, "Elden Ring": 176.1, "F1 24": 195.1, "Ghost of Tsushima": 119.4, "God of War Ragnarok": 129.8, "Hogwarts Legacy": 94.8, "Horizon: Forbidden West": 116.2, "Kingdom Come 2": 124.1, "Monster Hunter Wilds": 63.6, "No Rest for the Wicked": 143.1, "Resident Evil 4": 140.3, "Spider-Man 2": 125.9, "Stalker 2": 84.1, "Star Wars Outlaws": 74.5, "Starfield": 101.2, "The Last of Us Pt.1": 100.5, "The Witcher 3": 269.4},
    "r4k": {"Alan Wake 2": 53.4, "Assassin's Creed Mirage": 90.4, "Assassin's Creed Shadows": 42.5, "Avowed": 34.7, "Baldur's Gate 3": 100.6, "Black Myth Wukong": 33.3, "Counter-Strike 2": 191.9, "Cyberpunk 2077": 59.0, "DOOM Eternal": 158.3, "Dragon Age Veilguard": 64.1, "Elden Ring": 107.8, "F1 24": 147.4, "Ghost of Tsushima": 70.8, "God of War Ragnarok": 83.8, "Hogwarts Legacy": 53.3, "Horizon: Forbidden West": 74.1, "Kingdom Come 2": 68.7, "Monster Hunter Wilds": 43.2, "No Rest for the Wicked": 77.6, "Resident Evil 4": 82.5, "Spider-Man 2": 71.8, "Stalker 2": 51.6, "Star Wars Outlaws": 39.1, "Starfield": 66.3, "The Last of Us Pt.1": 61.3, "The Witcher 3": 158.5},
  },
  "RTX 5080 16 GB": {
    "r1080": {"Alan Wake 2": 140.4, "Assassin's Creed Mirage": 178.4, "Assassin's Creed Shadows": 79.5, "Avowed": 91.9, "Baldur's Gate 3": 208.0, "Black Myth Wukong": 81.8, "Counter-Strike 2": 562.9, "Cyberpunk 2077": 210.3, "DOOM Eternal": 315.8, "Dragon Age Veilguard": 139.4, "Elden Ring": 195.8, "F1 24": 270.4, "Ghost of Tsushima": 176.6, "God of War Ragnarok": 176.7, "Hogwarts Legacy": 139.5, "Horizon: Forbidden West": 160.0, "Kingdom Come 2": 187.1, "Monster Hunter Wilds": 82.3, "No Rest for the Wicked": 250.9, "Resident Evil 4": 211.3, "Spider-Man 2": 183.5, "Stalker 2": 118.0, "Star Wars Outlaws": 123.9, "Starfield": 134.7, "The Last of Us Pt.1": 147.7, "The Witcher 3": 394.6},
    "r1440": {"Alan Wake 2": 104.5, "Assassin's Creed Mirage": 145.6, "Assassin's Creed Shadows": 68.6, "Avowed": 68.0, "Baldur's Gate 3": 186.8, "Black Myth Wukong": 59.6, "Counter-Strike 2": 409.2, "Cyberpunk 2077": 142.9, "DOOM Eternal": 259.8, "Dragon Age Veilguard": 114.7, "Elden Ring": 191.5, "F1 24": 236.5, "Ghost of Tsushima": 134.8, "God of War Ragnarok": 146.5, "Hogwarts Legacy": 107.0, "Horizon: Forbidden West": 130.5, "Kingdom Come 2": 139.5, "Monster Hunter Wilds": 70.2, "No Rest for the Wicked": 162.2, "Resident Evil 4": 156.5, "Spider-Man 2": 139.6, "Stalker 2": 91.0, "Star Wars Outlaws": 87.1, "Starfield": 110.1, "The Last of Us Pt.1": 113.6, "The Witcher 3": 318.4},
    "r4k": {"Alan Wake 2": 60.8, "Assassin's Creed Mirage": 100.6, "Assassin's Creed Shadows": 46.8, "Avowed": 39.0, "Baldur's Gate 3": 118.8, "Black Myth Wukong": 38.0, "Counter-Strike 2": 224.0, "Cyberpunk 2077": 72.0, "DOOM Eternal": 180.1, "Dragon Age Veilguard": 74.0, "Elden Ring": 127.1, "F1 24": 167.0, "Ghost of Tsushima": 80.8, "God of War Ragnarok": 97.9, "Hogwarts Legacy": 63.6, "Horizon: Forbidden West": 84.0, "Kingdom Come 2": 80.0, "Monster Hunter Wilds": 48.3, "No Rest for the Wicked": 94.5, "Resident Evil 4": 97.0, "Spider-Man 2": 80.4, "Stalker 2": 57.9, "Star Wars Outlaws": 46.6, "Starfield": 75.3, "The Last of Us Pt.1": 70.3, "The Witcher 3": 192.3},
  },
  "RTX 5090 32 GB": {
    "r1080": {"Alan Wake 2": 202.1, "Assassin's Creed Mirage": 206.8, "Baldur's Gate 3": 209.3, "Black Myth Wukong": 112.0, "Counter-Strike 2": 723.0, "Cyberpunk 2077": 241.2, "DOOM Eternal": 392.9, "Dragon Age Veilguard": 187.7, "Elden Ring": 196.3, "F1 24": 364.8, "God of War Ragnarok": 208.6, "Hogwarts Legacy": 188.2, "Horizon: Forbidden West": 198.5, "No Rest for the Wicked": 287.2, "Resident Evil 4": 309.2, "Stalker 2": 149.1, "Star Wars Outlaws": 186.4, "Starfield": 179.2, "The Last of Us Pt.1": 182.7, "The Witcher 3": 537.9},
    "r1440": {"Alan Wake 2": 155.1, "Assassin's Creed Mirage": 181.2, "Baldur's Gate 3": 207.2, "Black Myth Wukong": 83.2, "Counter-Strike 2": 586.5, "Cyberpunk 2077": 210.0, "Dragon Age Veilguard": 158.0, "Elden Ring": 197.8, "F1 24": 320.1, "Ghost of Tsushima": 196.6, "Hogwarts Legacy": 152.0, "Horizon: Forbidden West": 177.4, "No Rest for the Wicked": 249.8, "Resident Evil 4": 247.8, "Stalker 2": 123.8, "Star Wars Outlaws": 134.4, "Starfield": 152.8, "The Last of Us Pt.1": 166.9, "The Witcher 3": 452.1},
    "r4k": {"Alan Wake 2": 92.1, "Assassin's Creed Mirage": 133.4, "Baldur's Gate 3": 177.2, "Black Myth Wukong": 56.9, "Counter-Strike 2": 348.3, "Cyberpunk 2077": 108.3, "DOOM Eternal": 249.5, "Elden Ring": 183.9, "F1 24": 247.6, "God of War Ragnarok": 155.9, "Hogwarts Legacy": 95.9, "Horizon: Forbidden West": 124.7, "No Rest for the Wicked": 151.6, "Resident Evil 4": 157.2, "Stalker 2": 82.9, "Star Wars Outlaws": 78.2, "Starfield": 109.3, "The Last of Us Pt.1": 109.1, "The Witcher 3": 300.6},
  },
  "RX 5700 XT 8 GB": {
    "r1080": {"A Plague Tale: Requiem": 65.2, "Alan Wake 2": 25.6, "Assassin's Creed Mirage": 72.6, "Atomic Heart": 45.8, "Baldur's Gate 3": 84.9, "Battlefield V": 171.9, "Cities Skylines II": 19.2, "Counter-Strike 2": 180.3, "Cyberpunk 2077": 56.3, "DOOM Eternal": 109.5, "Dead Space": 59.5, "Elden Ring": 73.1, "F1 23": 82.5, "Far Cry 6": 114.5, "God of War": 70.1, "Hogwarts Legacy": 54.4, "Jedi Survivor": 57.1, "Lords of the Fallen": 31.0, "Ratchet & Clank": 50.1, "Remnant II": 65.1, "Resident Evil 4": 71.7, "Spider-Man Remastered": 102.1, "Starfield": 42.6, "The Witcher 3": 116.7},
    "r1440": {"A Plague Tale: Requiem": 45.3, "Alan Wake 2": 20.5, "Assassin's Creed Mirage": 54.3, "Atomic Heart": 37.1, "Baldur's Gate 3": 57.2, "Battlefield V": 128.4, "Cities Skylines II": 14.6, "Counter-Strike 2": 122.2, "Cyberpunk 2077": 35.6, "DOOM Eternal": 88.6, "Dead Space": 40.5, "Elden Ring": 57.6, "F1 23": 67.7, "Far Cry 6": 79.5, "God of War": 55.0, "Hogwarts Legacy": 38.8, "Jedi Survivor": 37.6, "Lords of the Fallen": 21.0, "Ratchet & Clank": 38.2, "Remnant II": 47.7, "Resident Evil 4": 50.8, "Spider-Man Remastered": 73.6, "Starfield": 32.9, "The Witcher 3": 86.3},
    "r4k": {"A Plague Tale: Requiem": 24.2, "Alan Wake 2": 13.1, "Assassin's Creed Mirage": 30.7, "Atomic Heart": 24.6, "Baldur's Gate 3": 30.8, "Battlefield V": 72.2, "Cities Skylines II": 8.5, "Counter-Strike 2": 64.9, "Cyberpunk 2077": 15.8, "DOOM Eternal": 54.8, "Dead Space": 18.0, "Elden Ring": 36.0, "F1 23": 44.4, "Far Cry 6": 40.6, "God of War": 34.2, "Hogwarts Legacy": 20.4, "Jedi Survivor": 19.1, "Lords of the Fallen": 11.0, "Ratchet & Clank": 21.3, "Remnant II": 27.5, "Resident Evil 4": 28.3, "Spider-Man Remastered": 39.3, "Starfield": 19.9, "The Witcher 3": 49.3},
  },
  "RX 580 8 GB": {
    "r1080": {"A Plague Tale: Requiem": 31.7, "Alan Wake 2": 1.4, "Assassin's Creed Mirage": 37.8, "Atomic Heart": 23.9, "Baldur's Gate 3": 40.2, "Battlefield V": 84.2, "Cities Skylines II": 10.1, "Counter-Strike 2": 72.3, "Cyberpunk 2077": 30.5, "DOOM Eternal": 60.8, "Dead Space": 27.1, "Elden Ring": 39.8, "F1 23": 44.9, "Far Cry 6": 52.7, "God of War": 35.7, "Hogwarts Legacy": 27.4, "Jedi Survivor": 27.7, "Lords of the Fallen": 14.9, "Ratchet & Clank": 25.6, "Remnant II": 30.0, "Resident Evil 4": 31.7, "Spider-Man Remastered": 58.0, "Starfield": 19.2, "The Witcher 3": 59.8},
    "r1440": {"A Plague Tale: Requiem": 22.3, "Alan Wake 2": 1.3, "Assassin's Creed Mirage": 29.2, "Atomic Heart": 19.4, "Baldur's Gate 3": 28.6, "Battlefield V": 63.9, "Cities Skylines II": 8.0, "Counter-Strike 2": 50.1, "Cyberpunk 2077": 18.7, "DOOM Eternal": 48.3, "Dead Space": 18.4, "Elden Ring": 31.4, "F1 23": 36.1, "Far Cry 6": 37.3, "God of War": 27.8, "Hogwarts Legacy": 19.1, "Jedi Survivor": 18.3, "Lords of the Fallen": 10.7, "Ratchet & Clank": 17.6, "Remnant II": 22.1, "Resident Evil 4": 22.5, "Spider-Man Remastered": 42.6, "Starfield": 15.3, "The Witcher 3": 45.0},
    "r4k": {"A Plague Tale: Requiem": 11.9, "Alan Wake 2": 1.2, "Assassin's Creed Mirage": 16.8, "Atomic Heart": 12.7, "Baldur's Gate 3": 15.4, "Battlefield V": 35.4, "Cities Skylines II": 4.6, "Counter-Strike 2": 25.5, "Cyberpunk 2077": 8.1, "DOOM Eternal": 28.7, "Dead Space": 9.6, "Elden Ring": 19.5, "F1 23": 23.3, "Far Cry 6": 20.0, "God of War": 16.5, "Hogwarts Legacy": 9.9, "Jedi Survivor": 9.1, "Lords of the Fallen": 5.7, "Ratchet & Clank": 9.8, "Remnant II": 12.7, "Resident Evil 4": 13.3, "Spider-Man Remastered": 23.5, "Starfield": 9.4, "The Witcher 3": 26.5},
  },
  "RX 6500 XT 4 GB": {
    "r1080": {"A Plague Tale: Requiem": 34.5, "Alan Wake 2": 20.6, "Assassin's Creed Mirage": 32.8, "Atomic Heart": 21.4, "Baldur's Gate 3": 40.0, "Battlefield V": 87.6, "Cities Skylines II": 7.0, "Counter-Strike 2": 91.9, "Cyberpunk 2077": 27.0, "DOOM Eternal": 51.4, "Dead Space": 17.5, "Elden Ring": 44.2, "F1 23": 25.0, "Far Cry 6": 46.3, "God of War": 25.0, "Hogwarts Legacy": 18.7, "Jedi Survivor": 24.7, "Lords of the Fallen": 14.5, "Ratchet & Clank": 17.2, "Remnant II": 16.9, "Resident Evil 4": 17.5, "Spider-Man Remastered": 37.0, "Starfield": 23.1, "The Witcher 3": 60.8},
    "r1440": {"A Plague Tale: Requiem": 15.1, "Alan Wake 2": 12.9, "Assassin's Creed Mirage": 21.0, "Atomic Heart": 12.9, "Baldur's Gate 3": 26.8, "Battlefield V": 52.1, "Cities Skylines II": 6.6, "Counter-Strike 2": 59.4, "Cyberpunk 2077": 13.9, "DOOM Eternal": 18.4, "Dead Space": 10.4, "Elden Ring": 32.6, "F1 23": 19.3, "Far Cry 6": 7.7, "God of War": 14.8, "Hogwarts Legacy": 13.0, "Jedi Survivor": 16.2, "Lords of the Fallen": 9.1, "Ratchet & Clank": 8.6, "Remnant II": 13.0, "Resident Evil 4": 9.1, "Spider-Man Remastered": 20.2, "Starfield": 17.4, "The Witcher 3": 43.7},
    "r4k": {"A Plague Tale: Requiem": 7.9, "Alan Wake 2": 2.3, "Assassin's Creed Mirage": 11.5, "Atomic Heart": 7.6, "Baldur's Gate 3": 11.9, "Battlefield V": 22.5, "Cities Skylines II": 2.6, "Counter-Strike 2": 21.0, "Cyberpunk 2077": 4.4, "DOOM Eternal": 10.5, "Dead Space": 1.7, "Elden Ring": 13.1, "F1 23": 12.1, "Far Cry 6": 2.1, "God of War": 6.2, "Hogwarts Legacy": 5.0, "Jedi Survivor": 7.3, "Lords of the Fallen": 2.2, "Ratchet & Clank": 3.1, "Remnant II": 7.0, "Resident Evil 4": 6.3, "Spider-Man Remastered": 10.2, "Starfield": 9.8, "The Witcher 3": 23.9},
  },
  "RX 6600 8 GB": {
    "r1080": {"A Plague Tale: Requiem": 54.8, "Alan Wake 2": 40.1, "Assassin's Creed Mirage": 69.8, "Atomic Heart": 39.2, "Baldur's Gate 3": 76.9, "Battlefield V": 149.0, "Cities Skylines II": 16.3, "Counter-Strike 2": 146.3, "Cyberpunk 2077": 58.8, "DOOM Eternal": 121.7, "Dead Space": 59.1, "Elden Ring": 67.1, "F1 23": 72.8, "Far Cry 6": 104.4, "God of War": 61.1, "Hogwarts Legacy": 51.6, "Jedi Survivor": 51.1, "Lords of the Fallen": 26.7, "Ratchet & Clank": 44.8, "Remnant II": 58.4, "Resident Evil 4": 63.2, "Spider-Man Remastered": 96.6, "Starfield": 34.4, "The Witcher 3": 104.1},
    "r1440": {"A Plague Tale: Requiem": 36.5, "Alan Wake 2": 26.8, "Assassin's Creed Mirage": 49.1, "Atomic Heart": 31.2, "Baldur's Gate 3": 52.4, "Battlefield V": 102.2, "Cities Skylines II": 12.5, "Counter-Strike 2": 97.4, "Cyberpunk 2077": 34.1, "DOOM Eternal": 90.5, "Dead Space": 35.8, "Elden Ring": 50.2, "F1 23": 60.6, "Far Cry 6": 70.7, "God of War": 47.1, "Hogwarts Legacy": 33.9, "Jedi Survivor": 32.3, "Lords of the Fallen": 17.8, "Ratchet & Clank": 32.6, "Remnant II": 40.6, "Resident Evil 4": 44.1, "Spider-Man Remastered": 65.6, "Starfield": 25.6, "The Witcher 3": 75.2},
    "r4k": {"A Plague Tale: Requiem": 18.9, "Alan Wake 2": 14.1, "Assassin's Creed Mirage": 25.6, "Atomic Heart": 21.0, "Baldur's Gate 3": 27.1, "Battlefield V": 52.6, "Cities Skylines II": 6.8, "Counter-Strike 2": 50.0, "Cyberpunk 2077": 14.3, "DOOM Eternal": 48.9, "Dead Space": 12.8, "Elden Ring": 28.6, "F1 23": 32.1, "Far Cry 6": 16.1, "God of War": 27.7, "Hogwarts Legacy": 16.9, "Jedi Survivor": 15.9, "Lords of the Fallen": 9.2, "Ratchet & Clank": 17.1, "Remnant II": 21.9, "Resident Evil 4": 23.7, "Spider-Man Remastered": 35.1, "Starfield": 14.6, "The Witcher 3": 39.7},
  },
  "RX 6800 XT 16 GB": {
    "r1080": {"Alan Wake 2": 89.4, "Assassin's Creed Shadows": 54.4, "Avowed": 56.4, "Baldur's Gate 3": 165.8, "Black Myth Wukong": 38.5, "Counter-Strike 2": 374.6, "Cyberpunk 2077": 125.5, "DOOM Eternal": 230.4, "Dragon Age Veilguard": 75.2, "Elden Ring": 118.3, "F1 24": 176.6, "Ghost of Tsushima": 131.6, "God of War Ragnarok": 92.1, "Hogwarts Legacy": 92.4, "Horizon: Forbidden West": 102.9, "Kingdom Come 2": 98.7, "Monster Hunter Wilds": 58.5, "No Rest for the Wicked": 126.7, "Spider-Man 2": 104.9, "Stalker 2": 65.9, "Star Wars Outlaws": 62.4, "Starfield": 79.7, "The Last of Us Pt.1": 97.5, "The Witcher 3": 218.6},
    "r1440": {"Alan Wake 2": 62.0, "Assassin's Creed Shadows": 45.4, "Avowed": 37.3, "Baldur's Gate 3": 121.0, "Black Myth Wukong": 30.6, "Counter-Strike 2": 260.2, "Cyberpunk 2077": 80.5, "DOOM Eternal": 186.9, "Dragon Age Veilguard": 61.3, "Elden Ring": 99.2, "F1 24": 145.8, "Ghost of Tsushima": 97.8, "God of War Ragnarok": 75.0, "Hogwarts Legacy": 75.6, "Horizon: Forbidden West": 81.3, "Kingdom Come 2": 71.7, "Monster Hunter Wilds": 46.7, "No Rest for the Wicked": 77.4, "Spider-Man 2": 75.7, "Stalker 2": 48.2, "Star Wars Outlaws": 41.9, "Starfield": 61.5, "The Last of Us Pt.1": 70.5, "The Witcher 3": 169.6},
    "r4k": {"Alan Wake 2": 33.9, "Assassin's Creed Shadows": 32.1, "Avowed": 18.8, "Baldur's Gate 3": 64.9, "Black Myth Wukong": 18.9, "Counter-Strike 2": 133.3, "Cyberpunk 2077": 33.0, "DOOM Eternal": 111.6, "Dragon Age Veilguard": 40.4, "Elden Ring": 62.6, "F1 24": 97.5, "Ghost of Tsushima": 55.5, "God of War Ragnarok": 47.7, "Hogwarts Legacy": 42.8, "Horizon: Forbidden West": 49.8, "Kingdom Come 2": 39.6, "Monster Hunter Wilds": 29.1, "No Rest for the Wicked": 41.4, "Spider-Man 2": 42.2, "Stalker 2": 27.9, "Star Wars Outlaws": 21.2, "Starfield": 36.6, "The Last of Us Pt.1": 39.1, "The Witcher 3": 100.3},
  },
  "RX 6900 XT 16 GB": {
    "r1080": {"Alan Wake 2": 95.5, "Assassin's Creed Shadows": 56.7, "Avowed": 60.0, "Baldur's Gate 3": 176.9, "Black Myth Wukong": 40.5, "Counter-Strike 2": 397.1, "Cyberpunk 2077": 132.5, "DOOM Eternal": 241.1, "Dragon Age Veilguard": 79.9, "Elden Ring": 127.5, "F1 24": 191.0, "Ghost of Tsushima": 138.8, "God of War Ragnarok": 95.9, "Hogwarts Legacy": 103.8, "Horizon: Forbidden West": 108.3, "Kingdom Come 2": 105.1, "Monster Hunter Wilds": 62.0, "No Rest for the Wicked": 135.9, "Spider-Man 2": 111.9, "Stalker 2": 68.9, "Star Wars Outlaws": 66.5, "Starfield": 87.2, "The Last of Us Pt.1": 102.4, "The Witcher 3": 231.0},
    "r1440": {"Alan Wake 2": 66.3, "Assassin's Creed Shadows": 49.4, "Avowed": 40.1, "Baldur's Gate 3": 130.2, "Black Myth Wukong": 32.4, "Counter-Strike 2": 279.1, "Cyberpunk 2077": 85.2, "DOOM Eternal": 197.2, "Dragon Age Veilguard": 65.1, "Elden Ring": 105.9, "F1 24": 159.1, "Ghost of Tsushima": 102.7, "God of War Ragnarok": 79.4, "Hogwarts Legacy": 79.4, "Horizon: Forbidden West": 86.2, "Kingdom Come 2": 77.5, "Monster Hunter Wilds": 49.8, "No Rest for the Wicked": 84.0, "Spider-Man 2": 80.9, "Stalker 2": 50.9, "Star Wars Outlaws": 44.7, "Starfield": 67.2, "The Last of Us Pt.1": 75.1, "The Witcher 3": 181.7},
    "r4k": {"Alan Wake 2": 36.5, "Assassin's Creed Shadows": 35.0, "Avowed": 20.1, "Baldur's Gate 3": 70.6, "Black Myth Wukong": 20.1, "Counter-Strike 2": 140.8, "Cyberpunk 2077": 34.9, "DOOM Eternal": 121.5, "Dragon Age Veilguard": 42.5, "Elden Ring": 67.2, "F1 24": 106.6, "Ghost of Tsushima": 58.4, "God of War Ragnarok": 50.5, "Hogwarts Legacy": 43.7, "Horizon: Forbidden West": 54.1, "Kingdom Come 2": 43.7, "Monster Hunter Wilds": 31.1, "No Rest for the Wicked": 45.6, "Spider-Man 2": 45.7, "Stalker 2": 29.7, "Star Wars Outlaws": 22.4, "Starfield": 40.7, "The Last of Us Pt.1": 41.8, "The Witcher 3": 108.2},
  },
  "RX 7600 8 GB": {
    "r1080": {"A Plague Tale: Requiem": 71.5, "Alan Wake 2": 57.2, "Assassin's Creed Mirage": 81.0, "Assassin's Creed Shadows": 35.7, "Atomic Heart": 51.3, "Avowed": 34.7, "Baldur's Gate 3": 96.3, "Battlefield V": 177.5, "Black Myth Wukong": 24.9, "Cities Skylines II": 23.7, "Counter-Strike 2": 167.2, "Cyberpunk 2077": 78.6, "DOOM Eternal": 135.3, "Dead Space": 60.2, "Dragon Age Veilguard": 46.3, "Elden Ring": 82.6, "F1 23": 96.5, "F1 24": 99.8, "Far Cry 6": 127.8, "Ghost of Tsushima": 77.7, "God of War": 75.4, "God of War Ragnarok": 56.9, "Hogwarts Legacy": 57.3, "Horizon: Forbidden West": 62.2, "Jedi Survivor": 63.7, "Kingdom Come 2": 66.2, "Lords of the Fallen": 35.9, "Monster Hunter Wilds": 38.0, "No Rest for the Wicked": 83.0, "Ratchet & Clank": 46.5, "Remnant II": 70.8, "Resident Evil 4": 73.7, "Spider-Man 2": 51.9, "Spider-Man Remastered": 114.0, "Stalker 2": 42.3, "Star Wars Outlaws": 36.8, "Starfield": 49.3, "The Last of Us Pt.1": 41.7, "The Witcher 3": 132.9},
    "r1440": {"A Plague Tale: Requiem": 49.7, "Alan Wake 2": 37.6, "Assassin's Creed Mirage": 45.3, "Assassin's Creed Shadows": 29.1, "Atomic Heart": 41.5, "Avowed": 22.1, "Baldur's Gate 3": 68.7, "Battlefield V": 125.2, "Black Myth Wukong": 18.4, "Cities Skylines II": 17.8, "Counter-Strike 2": 105.4, "Cyberpunk 2077": 49.6, "DOOM Eternal": 106.0, "Dead Space": 41.2, "Dragon Age Veilguard": 33.2, "Elden Ring": 60.5, "F1 23": 80.3, "F1 24": 70.3, "Far Cry 6": 87.3, "Ghost of Tsushima": 53.6, "God of War": 58.6, "God of War Ragnarok": 43.6, "Hogwarts Legacy": 40.1, "Horizon: Forbidden West": 46.3, "Jedi Survivor": 42.0, "Kingdom Come 2": 43.9, "Lords of the Fallen": 24.0, "Monster Hunter Wilds": 21.4, "No Rest for the Wicked": 49.7, "Ratchet & Clank": 34.0, "Remnant II": 50.4, "Resident Evil 4": 52.2, "Spider-Man 2": 34.0, "Spider-Man Remastered": 79.6, "Stalker 2": 29.5, "Star Wars Outlaws": 24.2, "Starfield": 37.7, "The Last of Us Pt.1": 33.5, "The Witcher 3": 96.0},
    "r4k": {"A Plague Tale: Requiem": 26.8, "Alan Wake 2": 18.5, "Assassin's Creed Mirage": 33.5, "Assassin's Creed Shadows": 19.4, "Atomic Heart": 28.1, "Avowed": 9.1, "Baldur's Gate 3": 35.1, "Battlefield V": 67.6, "Black Myth Wukong": 5.1, "Cities Skylines II": 10.0, "Counter-Strike 2": 52.3, "Cyberpunk 2077": 22.1, "DOOM Eternal": 60.4, "Dead Space": 20.8, "Dragon Age Veilguard": 18.7, "Elden Ring": 34.0, "F1 23": 28.0, "F1 24": 23.9, "Far Cry 6": 16.2, "Ghost of Tsushima": 27.9, "God of War": 36.3, "God of War Ragnarok": 22.0, "Hogwarts Legacy": 21.6, "Horizon: Forbidden West": 25.8, "Jedi Survivor": 21.1, "Kingdom Come 2": 22.9, "Lords of the Fallen": 12.4, "Monster Hunter Wilds": 14.3, "No Rest for the Wicked": 25.4, "Ratchet & Clank": 18.2, "Remnant II": 28.8, "Resident Evil 4": 29.4, "Spider-Man 2": 17.9, "Spider-Man Remastered": 43.4, "Stalker 2": 4.8, "Star Wars Outlaws": 12.3, "Starfield": 22.6, "The Last of Us Pt.1": 5.4, "The Witcher 3": 50.7},
  },
  "RX 7600 XT 16 GB": {
    "r1080": {"Alan Wake 2": 60.4, "Assassin's Creed Shadows": 37.5, "Avowed": 36.4, "Baldur's Gate 3": 101.2, "Black Myth Wukong": 26.2, "Counter-Strike 2": 168.9, "Cyberpunk 2077": 84.9, "DOOM Eternal": 140.4, "Dragon Age Veilguard": 52.0, "Elden Ring": 83.9, "F1 24": 117.8, "Ghost of Tsushima": 81.3, "God of War Ragnarok": 58.8, "Hogwarts Legacy": 60.6, "Horizon: Forbidden West": 64.2, "Kingdom Come 2": 69.0, "Monster Hunter Wilds": 38.2, "No Rest for the Wicked": 87.7, "Spider-Man 2": 69.9, "Stalker 2": 44.8, "Star Wars Outlaws": 38.6, "Starfield": 55.6, "The Last of Us Pt.1": 62.7, "The Witcher 3": 140.1},
    "r1440": {"Alan Wake 2": 41.0, "Assassin's Creed Shadows": 29.6, "Avowed": 23.3, "Baldur's Gate 3": 71.0, "Black Myth Wukong": 19.6, "Counter-Strike 2": 107.2, "Cyberpunk 2077": 52.9, "DOOM Eternal": 112.0, "Dragon Age Veilguard": 40.6, "Elden Ring": 61.6, "F1 24": 94.3, "Ghost of Tsushima": 55.6, "God of War Ragnarok": 47.7, "Hogwarts Legacy": 41.3, "Horizon: Forbidden West": 48.1, "Kingdom Come 2": 46.0, "Monster Hunter Wilds": 29.1, "No Rest for the Wicked": 52.1, "Spider-Man 2": 48.0, "Stalker 2": 30.8, "Star Wars Outlaws": 25.4, "Starfield": 41.8, "The Last of Us Pt.1": 44.2, "The Witcher 3": 100.7},
    "r4k": {"Alan Wake 2": 22.6, "Assassin's Creed Shadows": 20.6, "Avowed": 11.6, "Baldur's Gate 3": 36.7, "Black Myth Wukong": 11.6, "Counter-Strike 2": 53.2, "Cyberpunk 2077": 23.5, "DOOM Eternal": 65.3, "Dragon Age Veilguard": 24.2, "Elden Ring": 34.6, "F1 24": 59.4, "Ghost of Tsushima": 29.9, "God of War Ragnarok": 30.2, "Hogwarts Legacy": 22.7, "Horizon: Forbidden West": 27.5, "Kingdom Come 2": 23.9, "Monster Hunter Wilds": 17.1, "No Rest for the Wicked": 26.8, "Spider-Man 2": 25.2, "Stalker 2": 16.7, "Star Wars Outlaws": 12.7, "Starfield": 24.6, "The Last of Us Pt.1": 23.6, "The Witcher 3": 52.4},
  },
  "RX 7700 XT 12 GB": {
    "r1080": {"Alan Wake 2": 84.9, "Assassin's Creed Shadows": 49.7, "Avowed": 55.1, "Baldur's Gate 3": 148.5, "Black Myth Wukong": 37.5, "Counter-Strike 2": 252.3, "Cyberpunk 2077": 115.8, "DOOM Eternal": 200.3, "Dragon Age Veilguard": 68.6, "Elden Ring": 113.4, "F1 24": 180.3, "Ghost of Tsushima": 109.9, "God of War Ragnarok": 80.5, "Hogwarts Legacy": 81.5, "Horizon: Forbidden West": 84.0, "Kingdom Come 2": 91.7, "Monster Hunter Wilds": 53.3, "No Rest for the Wicked": 134.0, "Spider-Man 2": 97.3, "Stalker 2": 59.6, "Star Wars Outlaws": 57.7, "Starfield": 70.5, "The Last of Us Pt.1": 73.9, "The Witcher 3": 204.1},
    "r1440": {"Alan Wake 2": 59.6, "Assassin's Creed Shadows": 43.3, "Avowed": 36.2, "Baldur's Gate 3": 108.9, "Black Myth Wukong": 29.2, "Counter-Strike 2": 161.7, "Cyberpunk 2077": 75.1, "DOOM Eternal": 165.2, "Dragon Age Veilguard": 55.5, "Elden Ring": 86.2, "F1 24": 145.5, "Ghost of Tsushima": 78.8, "God of War Ragnarok": 68.1, "Hogwarts Legacy": 62.0, "Horizon: Forbidden West": 67.1, "Kingdom Come 2": 65.0, "Monster Hunter Wilds": 41.8, "No Rest for the Wicked": 80.8, "Spider-Man 2": 70.8, "Stalker 2": 43.4, "Star Wars Outlaws": 38.3, "Starfield": 56.1, "The Last of Us Pt.1": 56.3, "The Witcher 3": 150.0},
    "r4k": {"Alan Wake 2": 32.0, "Assassin's Creed Shadows": 29.0, "Avowed": 18.1, "Baldur's Gate 3": 56.0, "Black Myth Wukong": 17.1, "Counter-Strike 2": 78.0, "Cyberpunk 2077": 32.8, "DOOM Eternal": 100.6, "Dragon Age Veilguard": 34.4, "Elden Ring": 49.3, "F1 24": 90.7, "Ghost of Tsushima": 43.6, "God of War Ragnarok": 44.7, "Hogwarts Legacy": 33.8, "Horizon: Forbidden West": 40.5, "Kingdom Come 2": 34.1, "Monster Hunter Wilds": 25.7, "No Rest for the Wicked": 42.3, "Spider-Man 2": 38.5, "Stalker 2": 24.6, "Star Wars Outlaws": 19.7, "Starfield": 34.7, "The Last of Us Pt.1": 28.8, "The Witcher 3": 79.4},
  },
  "RX 7800 XT 16 GB": {
    "r1080": {"Alan Wake 2": 100.5, "Assassin's Creed Shadows": 58.4, "Avowed": 62.9, "Baldur's Gate 3": 167.0, "Black Myth Wukong": 42.5, "Counter-Strike 2": 312.8, "Cyberpunk 2077": 135.1, "DOOM Eternal": 227.4, "Dragon Age Veilguard": 77.0, "Elden Ring": 127.9, "F1 24": 197.9, "Ghost of Tsushima": 130.4, "God of War Ragnarok": 93.2, "Hogwarts Legacy": 89.7, "Horizon: Forbidden West": 98.0, "Kingdom Come 2": 103.2, "Monster Hunter Wilds": 61.6, "No Rest for the Wicked": 153.7, "Spider-Man 2": 114.6, "Stalker 2": 67.6, "Star Wars Outlaws": 66.1, "Starfield": 89.0, "The Last of Us Pt.1": 99.4, "The Witcher 3": 219.0},
    "r1440": {"Alan Wake 2": 69.9, "Assassin's Creed Shadows": 49.5, "Avowed": 41.6, "Baldur's Gate 3": 120.0, "Black Myth Wukong": 33.3, "Counter-Strike 2": 205.3, "Cyberpunk 2077": 87.9, "DOOM Eternal": 185.5, "Dragon Age Veilguard": 63.0, "Elden Ring": 100.9, "F1 24": 165.6, "Ghost of Tsushima": 96.0, "God of War Ragnarok": 80.3, "Hogwarts Legacy": 72.8, "Horizon: Forbidden West": 78.8, "Kingdom Come 2": 76.0, "Monster Hunter Wilds": 49.1, "No Rest for the Wicked": 93.2, "Spider-Man 2": 83.6, "Stalker 2": 50.4, "Star Wars Outlaws": 43.7, "Starfield": 68.8, "The Last of Us Pt.1": 73.9, "The Witcher 3": 169.7},
    "r4k": {"Alan Wake 2": 38.8, "Assassin's Creed Shadows": 33.9, "Avowed": 21.2, "Baldur's Gate 3": 65.2, "Black Myth Wukong": 20.4, "Counter-Strike 2": 101.1, "Cyberpunk 2077": 39.5, "DOOM Eternal": 117.4, "Dragon Age Veilguard": 40.6, "Elden Ring": 60.1, "F1 24": 109.5, "Ghost of Tsushima": 54.8, "God of War Ragnarok": 53.0, "Hogwarts Legacy": 38.4, "Horizon: Forbidden West": 49.1, "Kingdom Come 2": 41.1, "Monster Hunter Wilds": 31.4, "No Rest for the Wicked": 50.3, "Spider-Man 2": 46.3, "Stalker 2": 29.2, "Star Wars Outlaws": 22.7, "Starfield": 43.0, "The Last of Us Pt.1": 41.9, "The Witcher 3": 96.7},
  },
  "RX 7900 GRE 16 GB": {
    "r1080": {"Alan Wake 2": 110.9, "Assassin's Creed Shadows": 59.2, "Avowed": 67.7, "Baldur's Gate 3": 184.5, "Black Myth Wukong": 44.6, "Counter-Strike 2": 340.8, "Cyberpunk 2077": 142.0, "DOOM Eternal": 249.2, "Dragon Age Veilguard": 86.2, "Elden Ring": 130.3, "F1 24": 221.7, "Ghost of Tsushima": 139.5, "God of War Ragnarok": 107.1, "Hogwarts Legacy": 103.5, "Horizon: Forbidden West": 109.2, "Kingdom Come 2": 112.7, "Monster Hunter Wilds": 68.0, "No Rest for the Wicked": 176.5, "Spider-Man 2": 126.6, "Stalker 2": 73.2, "Star Wars Outlaws": 75.3, "Starfield": 97.7, "The Last of Us Pt.1": 101.1, "The Witcher 3": 262.4},
    "r1440": {"Alan Wake 2": 77.5, "Assassin's Creed Shadows": 53.1, "Avowed": 45.9, "Baldur's Gate 3": 137.9, "Black Myth Wukong": 35.1, "Counter-Strike 2": 214.3, "Cyberpunk 2077": 94.6, "DOOM Eternal": 204.0, "Dragon Age Veilguard": 70.9, "Elden Ring": 102.9, "F1 24": 184.4, "Ghost of Tsushima": 102.5, "God of War Ragnarok": 88.5, "Hogwarts Legacy": 82.1, "Horizon: Forbidden West": 85.5, "Kingdom Come 2": 83.1, "Monster Hunter Wilds": 54.1, "No Rest for the Wicked": 108.2, "Spider-Man 2": 92.9, "Stalker 2": 55.4, "Star Wars Outlaws": 49.8, "Starfield": 76.6, "The Last of Us Pt.1": 75.8, "The Witcher 3": 200.4},
    "r4k": {"Alan Wake 2": 43.2, "Assassin's Creed Shadows": 36.1, "Avowed": 23.6, "Baldur's Gate 3": 75.0, "Black Myth Wukong": 22.0, "Counter-Strike 2": 103.7, "Cyberpunk 2077": 42.7, "DOOM Eternal": 128.2, "Dragon Age Veilguard": 44.9, "Elden Ring": 62.4, "F1 24": 119.3, "Ghost of Tsushima": 57.8, "God of War Ragnarok": 57.8, "Hogwarts Legacy": 46.4, "Horizon: Forbidden West": 53.4, "Kingdom Come 2": 45.9, "Monster Hunter Wilds": 33.7, "No Rest for the Wicked": 58.0, "Spider-Man 2": 51.3, "Stalker 2": 31.8, "Star Wars Outlaws": 25.7, "Starfield": 48.9, "The Last of Us Pt.1": 44.3, "The Witcher 3": 108.0},
  },
  "RX 7900 XT 20 GB": {
    "r1080": {"Alan Wake 2": 124.7, "Assassin's Creed Mirage": 173.3, "Assassin's Creed Shadows": 70.7, "Avowed": 77.9, "Baldur's Gate 3": 194.1, "Black Myth Wukong": 55.3, "Counter-Strike 2": 408.4, "Cyberpunk 2077": 165.6, "DOOM Eternal": 285.4, "Dragon Age Veilguard": 101.2, "Elden Ring": 155.1, "F1 24": 233.0, "Ghost of Tsushima": 164.9, "God of War Ragnarok": 128.5, "Hogwarts Legacy": 122.3, "Horizon: Forbidden West": 126.2, "Kingdom Come 2": 128.0, "Monster Hunter Wilds": 77.9, "No Rest for the Wicked": 193.5, "Resident Evil 4": 189.1, "Spider-Man 2": 144.5, "Stalker 2": 89.0, "Star Wars Outlaws": 87.2, "Starfield": 122.8, "The Last of Us Pt.1": 121.3, "The Witcher 3": 310.7},
    "r1440": {"Alan Wake 2": 90.3, "Assassin's Creed Mirage": 138.3, "Assassin's Creed Shadows": 60.1, "Avowed": 53.7, "Baldur's Gate 3": 159.7, "Black Myth Wukong": 43.4, "Counter-Strike 2": 273.9, "Cyberpunk 2077": 113.2, "DOOM Eternal": 233.1, "Dragon Age Veilguard": 83.1, "Elden Ring": 124.8, "F1 24": 192.1, "Ghost of Tsushima": 121.1, "God of War Ragnarok": 107.3, "Hogwarts Legacy": 94.5, "Horizon: Forbidden West": 102.1, "Kingdom Come 2": 94.5, "Monster Hunter Wilds": 62.7, "No Rest for the Wicked": 121.2, "Resident Evil 4": 141.5, "Spider-Man 2": 106.4, "Stalker 2": 67.7, "Star Wars Outlaws": 59.2, "Starfield": 97.7, "The Last of Us Pt.1": 91.2, "The Witcher 3": 239.6},
    "r4k": {"Alan Wake 2": 50.1, "Assassin's Creed Mirage": 84.1, "Assassin's Creed Shadows": 43.8, "Avowed": 27.9, "Baldur's Gate 3": 87.8, "Black Myth Wukong": 26.4, "Counter-Strike 2": 135.8, "Cyberpunk 2077": 52.6, "DOOM Eternal": 150.9, "Dragon Age Veilguard": 54.8, "Elden Ring": 76.8, "F1 24": 136.4, "Ghost of Tsushima": 70.6, "God of War Ragnarok": 70.2, "Hogwarts Legacy": 51.9, "Horizon: Forbidden West": 64.9, "Kingdom Come 2": 52.6, "Monster Hunter Wilds": 39.9, "No Rest for the Wicked": 63.7, "Resident Evil 4": 82.1, "Spider-Man 2": 60.3, "Stalker 2": 39.9, "Star Wars Outlaws": 30.7, "Starfield": 62.3, "The Last of Us Pt.1": 54.1, "The Witcher 3": 131.2},
  },
  "RX 7900 XTX 24 GB": {
    "r1080": {"Alan Wake 2": 141.7, "Assassin's Creed Mirage": 191.2, "Assassin's Creed Shadows": 84.7, "Avowed": 87.8, "Baldur's Gate 3": 194.6, "Black Myth Wukong": 63.0, "Counter-Strike 2": 472.6, "Cyberpunk 2077": 183.2, "DOOM Eternal": 319.5, "Dragon Age Veilguard": 112.8, "Elden Ring": 168.7, "F1 24": 265.8, "Ghost of Tsushima": 186.5, "God of War Ragnarok": 144.6, "Hogwarts Legacy": 138.7, "Horizon: Forbidden West": 144.7, "Kingdom Come 2": 142.1, "Monster Hunter Wilds": 85.5, "No Rest for the Wicked": 222.3, "Resident Evil 4": 215.9, "Spider-Man 2": 158.9, "Stalker 2": 97.6, "Star Wars Outlaws": 98.9, "Starfield": 137.8, "The Last of Us Pt.1": 137.6, "The Witcher 3": 357.7},
    "r1440": {"Alan Wake 2": 102.4, "Assassin's Creed Mirage": 156.6, "Assassin's Creed Shadows": 73.1, "Avowed": 61.0, "Baldur's Gate 3": 180.2, "Black Myth Wukong": 49.6, "Counter-Strike 2": 327.5, "Cyberpunk 2077": 129.2, "DOOM Eternal": 266.0, "Dragon Age Veilguard": 93.4, "Elden Ring": 141.3, "F1 24": 223.5, "Ghost of Tsushima": 135.6, "God of War Ragnarok": 120.3, "Hogwarts Legacy": 108.3, "Horizon: Forbidden West": 118.3, "Kingdom Come 2": 108.4, "Monster Hunter Wilds": 69.9, "No Rest for the Wicked": 144.8, "Resident Evil 4": 165.5, "Spider-Man 2": 118.5, "Stalker 2": 76.0, "Star Wars Outlaws": 68.5, "Starfield": 111.1, "The Last of Us Pt.1": 105.9, "The Witcher 3": 279.7},
    "r4k": {"Alan Wake 2": 58.7, "Assassin's Creed Mirage": 98.6, "Assassin's Creed Shadows": 52.8, "Avowed": 32.3, "Baldur's Gate 3": 104.1, "Black Myth Wukong": 31.1, "Counter-Strike 2": 163.2, "Cyberpunk 2077": 63.4, "DOOM Eternal": 175.4, "Dragon Age Veilguard": 64.2, "Elden Ring": 91.0, "F1 24": 162.8, "Ghost of Tsushima": 81.9, "God of War Ragnarok": 81.8, "Hogwarts Legacy": 62.0, "Horizon: Forbidden West": 77.1, "Kingdom Come 2": 63.6, "Monster Hunter Wilds": 46.1, "No Rest for the Wicked": 77.7, "Resident Evil 4": 99.0, "Spider-Man 2": 68.9, "Stalker 2": 45.8, "Star Wars Outlaws": 36.2, "Starfield": 72.4, "The Last of Us Pt.1": 64.1, "The Witcher 3": 158.6},
  },
  "RX 9060 XT 16 GB": {
    "r1080": {"Alan Wake 2": 81.3, "Assassin's Creed Shadows": 48.8, "Avowed": 50.7, "Baldur's Gate 3": 132.3, "Black Myth Wukong": 37.4, "Counter-Strike 2": 209.7, "Cyberpunk 2077": 111.5, "DOOM Eternal": 201.6, "Dragon Age Veilguard": 65.2, "Elden Ring": 107.5, "F1 24": 150.7, "Ghost of Tsushima": 103.7, "God of War Ragnarok": 91.8, "Hogwarts Legacy": 79.1, "Horizon: Forbidden West": 92.4, "Kingdom Come 2": 97.3, "Monster Hunter Wilds": 51.1, "No Rest for the Wicked": 119.1, "Spider-Man 2": 106.8, "Stalker 2": 61.3, "Star Wars Outlaws": 59.0, "Starfield": 70.0, "The Witcher 3": 171.6},
    "r1440": {"Alan Wake 2": 57.6, "Assassin's Creed Shadows": 39.3, "Avowed": 32.8, "Baldur's Gate 3": 94.5, "Black Myth Wukong": 28.2, "Counter-Strike 2": 127.6, "Cyberpunk 2077": 72.8, "DOOM Eternal": 163.8, "Dragon Age Veilguard": 50.9, "Elden Ring": 78.3, "F1 24": 120.5, "Ghost of Tsushima": 74.4, "God of War Ragnarok": 73.4, "Hogwarts Legacy": 57.7, "Horizon: Forbidden West": 70.5, "Kingdom Come 2": 67.1, "Monster Hunter Wilds": 40.4, "No Rest for the Wicked": 72.3, "Spider-Man 2": 73.3, "Stalker 2": 43.1, "Star Wars Outlaws": 39.5, "Starfield": 54.8, "The Witcher 3": 126.2},
    "r4k": {"Alan Wake 2": 32.1, "Assassin's Creed Shadows": 28.7, "Avowed": 16.2, "Baldur's Gate 3": 51.4, "Black Myth Wukong": 16.4, "Counter-Strike 2": 59.9, "Cyberpunk 2077": 33.6, "DOOM Eternal": 97.8, "Dragon Age Veilguard": 31.8, "Elden Ring": 43.4, "F1 24": 73.9, "Ghost of Tsushima": 41.0, "God of War Ragnarok": 45.9, "Hogwarts Legacy": 32.1, "Horizon: Forbidden West": 42.1, "Kingdom Come 2": 35.1, "Monster Hunter Wilds": 25.4, "No Rest for the Wicked": 38.6, "Spider-Man 2": 38.4, "Stalker 2": 23.2, "Star Wars Outlaws": 20.6, "Starfield": 33.4, "The Witcher 3": 71.2},
  },
  "RX 9060 XT 8 GB": {
    "r1080": {"Alan Wake 2": 78.9, "Assassin's Creed Shadows": 44.8, "Avowed": 48.7, "Baldur's Gate 3": 127.7, "Black Myth Wukong": 36.1, "Counter-Strike 2": 206.5, "Cyberpunk 2077": 107.8, "DOOM Eternal": 191.5, "Dragon Age Veilguard": 57.6, "Elden Ring": 103.1, "F1 24": 138.6, "Ghost of Tsushima": 102.0, "God of War Ragnarok": 88.4, "Hogwarts Legacy": 78.3, "Horizon: Forbidden West": 89.8, "Kingdom Come 2": 92.3, "Monster Hunter Wilds": 48.4, "No Rest for the Wicked": 112.4, "Spider-Man 2": 95.4, "Stalker 2": 58.5, "Star Wars Outlaws": 55.8, "Starfield": 65.3, "The Witcher 3": 161.3},
    "r1440": {"Alan Wake 2": 55.0, "Assassin's Creed Shadows": 38.1, "Avowed": 31.2, "Baldur's Gate 3": 91.6, "Black Myth Wukong": 26.9, "Counter-Strike 2": 126.8, "Cyberpunk 2077": 70.7, "DOOM Eternal": 156.0, "Dragon Age Veilguard": 47.3, "Elden Ring": 74.4, "F1 24": 108.1, "Ghost of Tsushima": 71.4, "God of War Ragnarok": 69.9, "Hogwarts Legacy": 56.2, "Horizon: Forbidden West": 68.1, "Kingdom Come 2": 63.6, "Monster Hunter Wilds": 39.4, "No Rest for the Wicked": 68.7, "Spider-Man 2": 66.1, "Stalker 2": 41.0, "Star Wars Outlaws": 37.7, "Starfield": 51.4, "The Witcher 3": 120.2},
    "r4k": {"Alan Wake 2": 29.6, "Assassin's Creed Shadows": 27.4, "Avowed": 15.0, "Baldur's Gate 3": 49.3, "Black Myth Wukong": 13.1, "Counter-Strike 2": 59.7, "Cyberpunk 2077": 32.5, "DOOM Eternal": 94.0, "Dragon Age Veilguard": 28.4, "Elden Ring": 41.5, "F1 24": 53.3, "Ghost of Tsushima": 39.8, "God of War Ragnarok": 42.3, "Hogwarts Legacy": 30.8, "Horizon: Forbidden West": 40.4, "Kingdom Come 2": 33.2, "Monster Hunter Wilds": 25.0, "No Rest for the Wicked": 36.9, "Spider-Man 2": 34.6, "Stalker 2": 15.6, "Star Wars Outlaws": 19.5, "Starfield": 31.4, "The Witcher 3": 68.6},
  },
  "RX 9070 16 GB": {
    "r1080": {"Alan Wake 2": 127.0, "Assassin's Creed Shadows": 72.6, "Avowed": 77.4, "Baldur's Gate 3": 195.7, "Black Myth Wukong": 58.1, "Counter-Strike 2": 381.3, "Cyberpunk 2077": 172.2, "DOOM Eternal": 264.1, "Dragon Age Veilguard": 100.0, "Elden Ring": 160.9, "F1 24": 234.1, "Ghost of Tsushima": 166.2, "God of War Ragnarok": 143.1, "Hogwarts Legacy": 116.7, "Horizon: Forbidden West": 138.9, "Kingdom Come 2": 136.3, "Monster Hunter Wilds": 80.9, "No Rest for the Wicked": 186.3, "Spider-Man 2": 153.3, "Stalker 2": 87.5, "Star Wars Outlaws": 90.7, "Starfield": 107.3, "The Last of Us Pt.1": 113.7, "The Witcher 3": 273.3},
    "r1440": {"Alan Wake 2": 92.3, "Assassin's Creed Shadows": 62.2, "Avowed": 51.7, "Baldur's Gate 3": 155.1, "Black Myth Wukong": 45.2, "Counter-Strike 2": 252.3, "Cyberpunk 2077": 117.0, "DOOM Eternal": 225.3, "Dragon Age Veilguard": 81.0, "Elden Ring": 121.9, "F1 24": 192.7, "Ghost of Tsushima": 122.9, "God of War Ragnarok": 115.9, "Hogwarts Legacy": 92.0, "Horizon: Forbidden West": 109.3, "Kingdom Come 2": 98.0, "Monster Hunter Wilds": 65.0, "No Rest for the Wicked": 119.3, "Spider-Man 2": 109.7, "Stalker 2": 65.2, "Star Wars Outlaws": 61.8, "Starfield": 85.3, "The Last of Us Pt.1": 87.7, "The Witcher 3": 214.1},
    "r4k": {"Alan Wake 2": 52.2, "Assassin's Creed Shadows": 45.0, "Avowed": 26.5, "Baldur's Gate 3": 87.5, "Black Myth Wukong": 27.2, "Counter-Strike 2": 120.1, "Cyberpunk 2077": 57.1, "DOOM Eternal": 146.7, "Dragon Age Veilguard": 52.4, "Elden Ring": 71.4, "F1 24": 127.9, "Ghost of Tsushima": 70.5, "God of War Ragnarok": 73.6, "Hogwarts Legacy": 55.1, "Horizon: Forbidden West": 69.9, "Kingdom Come 2": 54.7, "Monster Hunter Wilds": 41.3, "No Rest for the Wicked": 64.7, "Spider-Man 2": 60.4, "Stalker 2": 38.5, "Star Wars Outlaws": 32.8, "Starfield": 55.1, "The Last of Us Pt.1": 54.2, "The Witcher 3": 124.9},
  },
  "RX 9070 XT 16 GB": {
    "r1080": {"Alan Wake 2": 140.2, "Assassin's Creed Mirage": 185.5, "Assassin's Creed Shadows": 80.5, "Avowed": 87.5, "Baldur's Gate 3": 201.3, "Black Myth Wukong": 66.2, "Counter-Strike 2": 399.1, "Cyberpunk 2077": 185.7, "DOOM Eternal": 279.3, "Dragon Age Veilguard": 108.8, "Elden Ring": 167.7, "F1 24": 256.7, "Ghost of Tsushima": 179.6, "God of War Ragnarok": 159.6, "Hogwarts Legacy": 119.5, "Horizon: Forbidden West": 149.4, "Kingdom Come 2": 148.7, "Monster Hunter Wilds": 85.7, "No Rest for the Wicked": 208.2, "Resident Evil 4": 200.8, "Spider-Man 2": 168.5, "Stalker 2": 98.7, "Star Wars Outlaws": 103.2, "Starfield": 125.4, "The Last of Us Pt.1": 122.8, "The Witcher 3": 308.9},
    "r1440": {"Alan Wake 2": 102.6, "Assassin's Creed Mirage": 153.3, "Assassin's Creed Shadows": 67.6, "Avowed": 58.6, "Baldur's Gate 3": 173.8, "Black Myth Wukong": 50.5, "Counter-Strike 2": 262.8, "Cyberpunk 2077": 129.1, "DOOM Eternal": 275.4, "Dragon Age Veilguard": 89.7, "Elden Ring": 130.0, "F1 24": 215.4, "Ghost of Tsushima": 134.7, "God of War Ragnarok": 128.0, "Hogwarts Legacy": 91.4, "Horizon: Forbidden West": 120.9, "Kingdom Come 2": 110.5, "Monster Hunter Wilds": 68.2, "No Rest for the Wicked": 132.4, "Resident Evil 4": 148.0, "Spider-Man 2": 123.9, "Stalker 2": 75.4, "Star Wars Outlaws": 71.6, "Starfield": 101.8, "The Last of Us Pt.1": 96.3, "The Witcher 3": 239.5},
    "r4k": {"Alan Wake 2": 58.6, "Assassin's Creed Mirage": 100.4, "Assassin's Creed Shadows": 50.7, "Avowed": 30.2, "Baldur's Gate 3": 98.1, "Black Myth Wukong": 30.3, "Counter-Strike 2": 122.6, "Cyberpunk 2077": 63.7, "DOOM Eternal": 163.5, "Dragon Age Veilguard": 58.3, "Elden Ring": 78.6, "F1 24": 142.3, "Ghost of Tsushima": 77.8, "God of War Ragnarok": 83.3, "Hogwarts Legacy": 52.7, "Horizon: Forbidden West": 77.6, "Kingdom Come 2": 63.7, "Monster Hunter Wilds": 45.3, "No Rest for the Wicked": 71.8, "Resident Evil 4": 85.7, "Spider-Man 2": 69.3, "Stalker 2": 44.6, "Star Wars Outlaws": 38.3, "Starfield": 66.6, "The Last of Us Pt.1": 60.0, "The Witcher 3": 139.8},
  },
  "Zotac RTX 5070 Solid 12 GB": {
    "r1080": {"Alan Wake 2": 103.7, "Assassin's Creed Shadows": 60.9, "Avowed": 68.2, "Baldur's Gate 3": 177.0, "Black Myth Wukong": 54.3, "Counter-Strike 2": 434.0, "Cyberpunk 2077": 160.1, "DOOM Eternal": 233.2, "Dragon Age Veilguard": 103.7, "Elden Ring": 191.3, "F1 24": 220.1, "Ghost of Tsushima": 132.5, "God of War Ragnarok": 131.7, "Hogwarts Legacy": 118.2, "Horizon: Forbidden West": 125.9, "Kingdom Come 2": 143.7, "Monster Hunter Wilds": 64.3, "No Rest for the Wicked": 185.4, "Spider-Man 2": 132.6, "Stalker 2": 87.5, "Star Wars Outlaws": 84.4, "Starfield": 96.8, "The Last of Us Pt.1": 102.8, "The Witcher 3": 286.1},
    "r1440": {"Alan Wake 2": 74.7, "Assassin's Creed Shadows": 49.6, "Avowed": 47.9, "Baldur's Gate 3": 142.2, "Black Myth Wukong": 42.9, "Counter-Strike 2": 293.6, "Cyberpunk 2077": 105.0, "DOOM Eternal": 192.1, "Dragon Age Veilguard": 82.9, "Elden Ring": 164.1, "F1 24": 176.9, "Ghost of Tsushima": 96.5, "God of War Ragnarok": 105.9, "Hogwarts Legacy": 83.7, "Horizon: Forbidden West": 98.7, "Kingdom Come 2": 101.7, "Monster Hunter Wilds": 52.1, "No Rest for the Wicked": 117.8, "Spider-Man 2": 95.6, "Stalker 2": 67.2, "Star Wars Outlaws": 58.1, "Starfield": 78.0, "The Last of Us Pt.1": 75.5, "The Witcher 3": 220.9},
    "r4k": {"Alan Wake 2": 42.8, "Assassin's Creed Shadows": 33.1, "Avowed": 26.0, "Baldur's Gate 3": 77.9, "Black Myth Wukong": 25.9, "Counter-Strike 2": 156.2, "Cyberpunk 2077": 50.4, "DOOM Eternal": 125.6, "Dragon Age Veilguard": 51.0, "Elden Ring": 88.6, "F1 24": 120.0, "Ghost of Tsushima": 53.8, "God of War Ragnarok": 67.1, "Hogwarts Legacy": 47.9, "Horizon: Forbidden West": 61.0, "Kingdom Come 2": 53.7, "Monster Hunter Wilds": 33.3, "No Rest for the Wicked": 64.2, "Spider-Man 2": 52.6, "Stalker 2": 38.7, "Star Wars Outlaws": 29.9, "Starfield": 49.0, "The Last of Us Pt.1": 44.7, "The Witcher 3": 127.1},
  },
};

// ── GPU SPECS ───────────────────────────────────────────────────────
const GS = {
  "ASUS RTX 5090 TUF 32 GB": {"brand": "NVIDIA", "tdp": 575, "arch": "Blackwell", "proc": "4nm", "vram": "32GB GDDR7", "bus": "512-bit", "bw": "1792", "boost": 2407, "shaders": 21760, "launch": "Jan/2025"},
  "Arc A580 8 GB": {"brand": "Intel", "tdp": 175, "arch": "Alchemist", "proc": "6nm", "vram": "8GB GDDR6", "bus": "256-bit", "bw": "512", "boost": 2000, "shaders": 3072, "launch": "Nov/2023"},
  "Arc A750 8 GB": {"brand": "Intel", "tdp": 225, "arch": "Alchemist", "proc": "6nm", "vram": "8GB GDDR6", "bus": "256-bit", "bw": "512", "boost": 2050, "shaders": 3584, "launch": "Out/2022"},
  "Arc A770 16 GB": {"brand": "Intel", "tdp": 225, "arch": "Alchemist", "proc": "6nm", "vram": "16GB GDDR6", "bus": "256-bit", "bw": "560", "boost": 2100, "shaders": 4096, "launch": "Out/2022"},
  "Arc B580 12 GB": {"brand": "Intel", "tdp": 190, "arch": "Battlemage", "proc": "5nm", "vram": "12GB GDDR6", "bus": "192-bit", "bw": "456", "boost": 2670, "shaders": 2560, "launch": "Dez/2024"},
  "GTX 1060 6 GB": {"brand": "NVIDIA", "tdp": 120, "arch": "Pascal", "proc": "16nm", "vram": "6GB GDDR5", "bus": "192-bit", "bw": "192", "boost": 1771, "shaders": 1280, "launch": "Jul/2016"},
  "GTX 1660 Ti 6 GB": {"brand": "NVIDIA", "tdp": 120, "arch": "Turing", "proc": "12nm", "vram": "6GB GDDR6", "bus": "192-bit", "bw": "288", "boost": 1770, "shaders": 1536, "launch": "Fev/2019"},
  "RTX 2060 6 GB": {"brand": "NVIDIA", "tdp": 160, "arch": "Turing", "proc": "12nm", "vram": "6GB GDDR6", "bus": "192-bit", "bw": "336", "boost": 1680, "shaders": 1920, "launch": "Jan/2019"},
  "RTX 3050 8 GB": {"brand": "NVIDIA", "tdp": 130, "arch": "Ampere", "proc": "8nm", "vram": "8GB GDDR6", "bus": "128-bit", "bw": "224", "boost": 1777, "shaders": 2560, "launch": "Jan/2022"},
  "RTX 3050 Gaming 8 GB": {"brand": "NVIDIA", "tdp": 130, "arch": "Ampere", "proc": "8nm", "vram": "8GB GDDR6", "bus": "128-bit", "bw": "224", "boost": 1777, "shaders": 2560, "launch": "Jan/2022"},
  "RTX 3050 Pegasus 6 GB": {"brand": "NVIDIA", "tdp": 85, "arch": "Ampere", "proc": "8nm", "vram": "6GB GDDR6", "bus": "96-bit", "bw": "168", "boost": 1552, "shaders": 2048, "launch": "Jan/2023"},
  "RTX 3060 12 GB": {"brand": "NVIDIA", "tdp": 170, "arch": "Ampere", "proc": "8nm", "vram": "12GB GDDR6", "bus": "192-bit", "bw": "360", "boost": 1777, "shaders": 3584, "launch": "Fev/2021"},
  "RTX 3060 Ti 8 GB": {"brand": "NVIDIA", "tdp": 200, "arch": "Ampere", "proc": "8nm", "vram": "8GB GDDR6", "bus": "256-bit", "bw": "448", "boost": 1665, "shaders": 4864, "launch": "Dez/2020"},
  "RTX 3070 8 GB": {"brand": "NVIDIA", "tdp": 220, "arch": "Ampere", "proc": "8nm", "vram": "8GB GDDR6", "bus": "256-bit", "bw": "448", "boost": 1725, "shaders": 5888, "launch": "Out/2020"},
  "RTX 3080 10 GB": {"brand": "NVIDIA", "tdp": 320, "arch": "Ampere", "proc": "8nm", "vram": "10GB GDDR6X", "bus": "320-bit", "bw": "760", "boost": 1710, "shaders": 8704, "launch": "Set/2020"},
  "RTX 3090 24 GB": {"brand": "NVIDIA", "tdp": 350, "arch": "Ampere", "proc": "8nm", "vram": "24GB GDDR6X", "bus": "384-bit", "bw": "936", "boost": 1695, "shaders": 10496, "launch": "Set/2020"},
  "RTX 3090 Ti 24 GB": {"brand": "NVIDIA", "tdp": 450, "arch": "Ampere", "proc": "8nm", "vram": "24GB GDDR6X", "bus": "384-bit", "bw": "1008", "boost": 1860, "shaders": 10752, "launch": "Jan/2022"},
  "RTX 4060 8 GB": {"brand": "NVIDIA", "tdp": 115, "arch": "Ada Lovelace", "proc": "4nm", "vram": "8GB GDDR6", "bus": "128-bit", "bw": "272", "boost": 2460, "shaders": 3072, "launch": "Jun/2023"},
  "RTX 4060 Ti 16 GB": {"brand": "NVIDIA", "tdp": 165, "arch": "Ada Lovelace", "proc": "4nm", "vram": "16GB GDDR6", "bus": "128-bit", "bw": "288", "boost": 2535, "shaders": 4352, "launch": "Jul/2023"},
  "RTX 4060 Ti 8 GB": {"brand": "NVIDIA", "tdp": 160, "arch": "Ada Lovelace", "proc": "4nm", "vram": "8GB GDDR6", "bus": "128-bit", "bw": "288", "boost": 2535, "shaders": 4352, "launch": "Mai/2023"},
  "RTX 4070 12 GB": {"brand": "NVIDIA", "tdp": 200, "arch": "Ada Lovelace", "proc": "4nm", "vram": "12GB GDDR6X", "bus": "192-bit", "bw": "504", "boost": 2475, "shaders": 5888, "launch": "Abr/2023"},
  "RTX 4070 Super 12 GB": {"brand": "NVIDIA", "tdp": 220, "arch": "Ada Lovelace", "proc": "4nm", "vram": "12GB GDDR6X", "bus": "192-bit", "bw": "504", "boost": 2475, "shaders": 7168, "launch": "Jan/2024"},
  "RTX 4070 Ti 12 GB": {"brand": "NVIDIA", "tdp": 285, "arch": "Ada Lovelace", "proc": "4nm", "vram": "12GB GDDR6X", "bus": "192-bit", "bw": "504", "boost": 2610, "shaders": 7680, "launch": "Jan/2023"},
  "RTX 4070 Ti Super 16 GB": {"brand": "NVIDIA", "tdp": 285, "arch": "Ada Lovelace", "proc": "4nm", "vram": "16GB GDDR6X", "bus": "256-bit", "bw": "672", "boost": 2610, "shaders": 8448, "launch": "Jan/2024"},
  "RTX 4080 16 GB": {"brand": "NVIDIA", "tdp": 320, "arch": "Ada Lovelace", "proc": "4nm", "vram": "16GB GDDR6X", "bus": "256-bit", "bw": "717", "boost": 2505, "shaders": 9728, "launch": "Nov/2022"},
  "RTX 4080 Super 16 GB": {"brand": "NVIDIA", "tdp": 320, "arch": "Ada Lovelace", "proc": "4nm", "vram": "16GB GDDR6X", "bus": "256-bit", "bw": "736", "boost": 2550, "shaders": 10240, "launch": "Jan/2024"},
  "RTX 4090 24 GB": {"brand": "NVIDIA", "tdp": 450, "arch": "Ada Lovelace", "proc": "4nm", "vram": "24GB GDDR6X", "bus": "384-bit", "bw": "1008", "boost": 2520, "shaders": 16384, "launch": "Out/2022"},
  "RTX 5050 Gaming 8 GB": {"brand": "NVIDIA", "tdp": 130, "arch": "Blackwell", "proc": "4nm", "vram": "8GB GDDR7", "bus": "128-bit", "bw": "288", "boost": 2497, "shaders": 2560, "launch": "Mar/2025"},
  "RTX 5060 8 GB": {"brand": "NVIDIA", "tdp": 150, "arch": "Blackwell", "proc": "4nm", "vram": "8GB GDDR7", "bus": "128-bit", "bw": "336", "boost": 2497, "shaders": 3840, "launch": "Abr/2025"},
  "RTX 5060 Ti 16 GB": {"brand": "NVIDIA", "tdp": 180, "arch": "Blackwell", "proc": "4nm", "vram": "16GB GDDR7", "bus": "128-bit", "bw": "448", "boost": 2572, "shaders": 4608, "launch": "Abr/2025"},
  "RTX 5060 Ti 8 GB": {"brand": "NVIDIA", "tdp": 180, "arch": "Blackwell", "proc": "4nm", "vram": "8GB GDDR7", "bus": "128-bit", "bw": "448", "boost": 2572, "shaders": 4608, "launch": "Abr/2025"},
  "RTX 5070 12 GB": {"brand": "NVIDIA", "tdp": 250, "arch": "Blackwell", "proc": "4nm", "vram": "12GB GDDR7", "bus": "192-bit", "bw": "672", "boost": 2512, "shaders": 6144, "launch": "Fev/2025"},
  "RTX 5070 Ti 16 GB": {"brand": "NVIDIA", "tdp": 300, "arch": "Blackwell", "proc": "4nm", "vram": "16GB GDDR7", "bus": "256-bit", "bw": "896", "boost": 2452, "shaders": 8960, "launch": "Jan/2025"},
  "RTX 5080 16 GB": {"brand": "NVIDIA", "tdp": 360, "arch": "Blackwell", "proc": "4nm", "vram": "16GB GDDR7", "bus": "256-bit", "bw": "960", "boost": 2617, "shaders": 10752, "launch": "Jan/2025"},
  "RTX 5090 32 GB": {"brand": "NVIDIA", "tdp": 575, "arch": "Blackwell", "proc": "4nm", "vram": "32GB GDDR7", "bus": "512-bit", "bw": "1792", "boost": 2407, "shaders": 21760, "launch": "Jan/2025"},
  "RX 5700 XT 8 GB": {"brand": "AMD", "tdp": 225, "arch": "RDNA 1", "proc": "7nm", "vram": "8GB GDDR6", "bus": "256-bit", "bw": "448", "boost": 1905, "shaders": 2560, "launch": "Jul/2019"},
  "RX 580 8 GB": {"brand": "AMD", "tdp": 185, "arch": "GCN 4", "proc": "14nm", "vram": "8GB GDDR5", "bus": "256-bit", "bw": "256", "boost": 1340, "shaders": 2304, "launch": "Abr/2017"},
  "RX 6500 XT 4 GB": {"brand": "AMD", "tdp": 107, "arch": "RDNA 2", "proc": "6nm", "vram": "4GB GDDR6", "bus": "64-bit", "bw": "144", "boost": 2815, "shaders": 1024, "launch": "Jan/2022"},
  "RX 6600 8 GB": {"brand": "AMD", "tdp": 132, "arch": "RDNA 2", "proc": "7nm", "vram": "8GB GDDR6", "bus": "128-bit", "bw": "224", "boost": 2491, "shaders": 1792, "launch": "Out/2021"},
  "RX 6800 XT 16 GB": {"brand": "AMD", "tdp": 300, "arch": "RDNA 2", "proc": "7nm", "vram": "16GB GDDR6", "bus": "256-bit", "bw": "512", "boost": 2250, "shaders": 4608, "launch": "Nov/2020"},
  "RX 6900 XT 16 GB": {"brand": "AMD", "tdp": 300, "arch": "RDNA 2", "proc": "7nm", "vram": "16GB GDDR6", "bus": "256-bit", "bw": "512", "boost": 2250, "shaders": 5120, "launch": "Dez/2020"},
  "RX 7600 8 GB": {"brand": "AMD", "tdp": 165, "arch": "RDNA 3", "proc": "6nm", "vram": "8GB GDDR6", "bus": "128-bit", "bw": "288", "boost": 2655, "shaders": 2048, "launch": "Mai/2023"},
  "RX 7600 XT 16 GB": {"brand": "AMD", "tdp": 190, "arch": "RDNA 3", "proc": "6nm", "vram": "16GB GDDR6", "bus": "128-bit", "bw": "288", "boost": 2755, "shaders": 2048, "launch": "Jan/2025"},
  "RX 7700 XT 12 GB": {"brand": "AMD", "tdp": 245, "arch": "RDNA 3", "proc": "5nm", "vram": "12GB GDDR6", "bus": "192-bit", "bw": "432", "boost": 2599, "shaders": 3456, "launch": "Set/2023"},
  "RX 7800 XT 16 GB": {"brand": "AMD", "tdp": 263, "arch": "RDNA 3", "proc": "5nm", "vram": "16GB GDDR6", "bus": "256-bit", "bw": "624", "boost": 2430, "shaders": 3840, "launch": "Set/2023"},
  "RX 7900 GRE 16 GB": {"brand": "AMD", "tdp": 260, "arch": "RDNA 3", "proc": "5nm", "vram": "16GB GDDR6", "bus": "256-bit", "bw": "576", "boost": 2245, "shaders": 5120, "launch": "Ago/2023"},
  "RX 7900 XT 20 GB": {"brand": "AMD", "tdp": 315, "arch": "RDNA 3", "proc": "5nm", "vram": "20GB GDDR6", "bus": "320-bit", "bw": "800", "boost": 2394, "shaders": 10752, "launch": "Dez/2022"},
  "RX 7900 XTX 24 GB": {"brand": "AMD", "tdp": 355, "arch": "RDNA 3", "proc": "5nm", "vram": "24GB GDDR6", "bus": "384-bit", "bw": "960", "boost": 2500, "shaders": 12288, "launch": "Dez/2022"},
  "RX 9060 XT 16 GB": {"brand": "AMD", "tdp": 150, "arch": "RDNA 4", "proc": "4nm", "vram": "16GB GDDR6", "bus": "128-bit", "bw": "384", "boost": 2699, "shaders": 2048, "launch": "Mai/2025"},
  "RX 9060 XT 8 GB": {"brand": "AMD", "tdp": 150, "arch": "RDNA 4", "proc": "4nm", "vram": "8GB GDDR6", "bus": "128-bit", "bw": "384", "boost": 2699, "shaders": 2048, "launch": "Mai/2025"},
  "RX 9070 16 GB": {"brand": "AMD", "tdp": 220, "arch": "RDNA 4", "proc": "4nm", "vram": "16GB GDDR6", "bus": "256-bit", "bw": "576", "boost": 2520, "shaders": 3584, "launch": "Mar/2025"},
  "RX 9070 XT 16 GB": {"brand": "AMD", "tdp": 304, "arch": "RDNA 4", "proc": "4nm", "vram": "16GB GDDR6", "bus": "256-bit", "bw": "640", "boost": 2970, "shaders": 4096, "launch": "Mar/2025"},
  "Zotac RTX 5070 Solid 12 GB": {"brand": "NVIDIA", "tdp": 250, "arch": "Blackwell", "proc": "4nm", "vram": "12GB GDDR7", "bus": "192-bit", "bw": "672", "boost": 2512, "shaders": 6144, "launch": "Fev/2025"},
};

// ── CPU GAME DATA (29 CPUs × games × 2 resolutions) ──────────────
const CG = {
  "AMD Ryzen 5 5500": {
    "r1080": {"AC Valhalla": 110.0, "BG3": 108.0, "Battlefield V": 168.0, "CS:GO": 422.0, "CoD MW2I": 156.0, "Cyberpunk": 76.0, "Cyberpunk PL": 69.0, "F1 23": 192.0, "GTA V": 149.0, "R6 Siege": 379.0, "RDR2": 124.0},
    "r4k": {"AC Valhalla": 66.0, "Battlefield V": 111.0, "CS:GO": 318.0, "Cyberpunk": 44.0, "GTA V": 130.0, "RDR2": 73.0},
  },
  "AMD Ryzen 5 5500X3D": {
    "r1080": {"AC Valhalla": 218.0, "BG3": 175.0, "CS2": 577.0, "CoD MW2I": 297.0, "Cyberpunk PL": 106.0, "F1 23": 291.0},
  },
  "AMD Ryzen 5 5600": {
    "r1080": {"AC Valhalla": 113.0, "Battlefield V": 173.0, "CS:GO": 567.0, "Cyberpunk": 82.0, "GTA V": 160.0, "R6 Siege": 564.0, "RDR2": 132.0},
    "r4k": {"AC Valhalla": 65.0, "Battlefield V": 116.0, "CS:GO": 383.0, "Cyberpunk": 46.0, "GTA V": 134.0, "RDR2": 76.0},
  },
  "AMD Ryzen 5 5600G": {
    "r1080": {"Battlefield V": 171.0, "CS:GO": 555.0, "Cyberpunk": 83.0, "GTA V": 168.0, "R6 Siege": 447.0, "RDR2": 123.0},
    "r4k": {"Battlefield V": 101.0, "CS:GO": 341.0, "Cyberpunk": 38.0, "GTA V": 126.0, "RDR2": 68.0},
  },
  "AMD Ryzen 5 5600X": {
    "r1080": {"AC Valhalla": 115.0, "Battlefield V": 192.0, "CS:GO": 613.0, "Cyberpunk": 88.0, "GTA V": 182.0, "R6 Siege": 621.0, "RDR2": 132.0},
    "r4k": {"AC Valhalla": 64.0, "Battlefield V": 120.0, "CS:GO": 395.0, "Cyberpunk": 52.0, "GTA V": 132.0, "RDR2": 75.0},
  },
  "AMD Ryzen 5 7600": {
    "r1080": {"AC Valhalla": 181.0, "CS:GO": 753.0, "CoD MW2": 222.0, "Cyberpunk": 148.0, "F1 22": 266.0, "R6 Siege": 587.0, "RDR2": 174.0},
    "r4k": {"AC Valhalla": 115.0, "CS:GO": 460.0, "CoD MW2": 129.0, "Cyberpunk": 75.0, "F1 22": 188.0, "RDR2": 118.0},
  },
  "AMD Ryzen 5 7600X": {
    "r1080": {"AC Valhalla": 183.0, "CS:GO": 858.0, "CoD MW2": 223.0, "Cyberpunk": 163.0, "F1 22": 303.0, "R6 Siege": 615.0, "RDR2": 187.0},
    "r4k": {"AC Valhalla": 124.0, "CS:GO": 494.0, "CoD MW2": 128.0, "Cyberpunk": 80.0, "F1 22": 218.0, "RDR2": 120.0},
  },
  "AMD Ryzen 5 9600X": {
    "r1080": {"AC Valhalla": 216.0, "BG3": 205.0, "CS2": 635.0, "CoD MW2I": 281.0, "Cyberpunk PL": 110.0, "F1 23": 380.0},
  },
  "AMD Ryzen 7 5700X": {
    "r1080": {"AC Valhalla": 175.0, "BG3": 141.0, "CS:GO": 669.0, "CoD MW2": 206.0, "CoD MW2I": 239.0, "Cyberpunk": 138.0, "Cyberpunk PL": 84.0, "F1 22": 247.0, "F1 23": 264.0, "R6 Siege": 582.0, "RDR2": 156.0},
    "r4k": {"AC Valhalla": 122.0, "CS:GO": 457.0, "CoD MW2": 126.0, "Cyberpunk": 81.0, "F1 22": 212.0, "RDR2": 119.0},
  },
  "AMD Ryzen 7 5700X3D": {
    "r1080": {"AC Valhalla": 205.0, "BG3": 201.0, "CS2": 582.0, "CoD MW2I": 288.0, "Cyberpunk PL": 112.0, "F1 23": 335.0},
  },
  "AMD Ryzen 7 5800X3D": {
    "r1080": {"AC Valhalla": 215.0, "CS:GO": 684.0, "CoD MW2": 230.0, "Cyberpunk": 186.0, "F1 22": 347.0, "R6 Siege": 635.0, "RDR2": 201.0},
    "r4k": {"AC Valhalla": 124.0, "CS:GO": 466.0, "CoD MW2": 126.0, "Cyberpunk": 84.0, "F1 22": 225.0, "RDR2": 120.0},
  },
  "AMD Ryzen 7 7700": {
    "r1080": {"AC Valhalla": 189.0, "CS:GO": 845.0, "CoD MW2": 236.0, "Cyberpunk": 162.0, "F1 22": 308.0, "R6 Siege": 669.0, "RDR2": 182.0},
    "r4k": {"AC Valhalla": 122.0, "CS:GO": 492.0, "CoD MW2": 142.0, "Cyberpunk": 83.0, "F1 22": 222.0, "RDR2": 119.0},
  },
  "AMD Ryzen 7 7700X": {
    "r1080": {"AC Valhalla": 191.0, "CS:GO": 807.0, "CoD MW2": 230.0, "Cyberpunk": 164.0, "F1 22": 304.0, "R6 Siege": 716.0, "RDR2": 187.0},
    "r4k": {"AC Valhalla": 115.0, "CS:GO": 489.0, "CoD MW2": 128.0, "Cyberpunk": 80.0, "F1 22": 221.0, "RDR2": 119.0},
  },
  "AMD Ryzen 7 7800X3D": {
    "r1080": {"AC Valhalla": 221.0, "BG3": 240.0, "CS2": 769.0, "CoD MW2I": 311.0, "Cyberpunk PL": 119.0, "F1 23": 432.0},
  },
  "AMD Ryzen 7 9800X3D (24H2)": {
    "r1080": {"AC Valhalla": 216.0, "BG3": 277.0, "CS2": 828.0, "CoD MW2I": 296.0, "Cyberpunk PL": 120.0, "F1 23": 453.0},
  },
  "AMD Ryzen 9 5900X": {
    "r1080": {"AC Valhalla": 170.0, "CS:GO": 627.0, "CoD MW2": 214.0, "Cyberpunk": 139.0, "F1 22": 254.0, "R6 Siege": 575.0, "RDR2": 165.0},
    "r4k": {"AC Valhalla": 123.0, "CS:GO": 439.0, "CoD MW2": 123.0, "Cyberpunk": 77.0, "F1 22": 214.0, "RDR2": 118.0},
  },
  "AMD Ryzen 9 7900": {
    "r1080": {"AC Valhalla": 192.0, "CS:GO": 815.0, "CoD MW2": 235.0, "Cyberpunk": 162.0, "F1 22": 302.0, "R6 Siege": 659.0, "RDR2": 179.0},
    "r4k": {"AC Valhalla": 115.0, "CS:GO": 498.0, "CoD MW2": 130.0, "Cyberpunk": 79.0, "F1 22": 225.0, "RDR2": 119.0},
  },
  "Intel Core Ultra 5 245K": {
    "r1080": {"AC Valhalla": 192.0, "BG3": 169.0, "CS2": 471.0, "CoD MW2I": 234.0, "Cyberpunk PL": 98.0, "F1 23": 317.0},
  },
  "Intel Core i3-10100": {
    "r1080": {"AC Valhalla": 95.0, "Battlefield V": 113.0, "CS:GO": 297.0, "Cyberpunk": 58.0, "GTA V": 118.0, "R6 Siege": 281.0, "RDR2": 102.0},
    "r4k": {"AC Valhalla": 62.0, "Battlefield V": 105.0, "CS:GO": 269.0, "Cyberpunk": 43.0, "GTA V": 113.0, "RDR2": 75.0},
  },
  "Intel Core i3-12100F": {
    "r1080": {"AC Valhalla": 114.0, "Battlefield V": 180.0, "CS:GO": 495.0, "Cyberpunk": 85.0, "GTA V": 162.0, "R6 Siege": 375.0, "RDR2": 128.0},
    "r4k": {"AC Valhalla": 65.0, "Battlefield V": 114.0, "CS:GO": 355.0, "Cyberpunk": 44.0, "GTA V": 137.0, "RDR2": 77.0},
  },
  "Intel Core i3-13100": {
    "r1080": {"AC Valhalla": 148.0, "CS:GO": 481.0, "CoD MW2": 82.0, "Cyberpunk": 112.0, "F1 22": 191.0, "R6 Siege": 321.0, "RDR2": 126.0},
    "r4k": {"AC Valhalla": 124.0, "CS:GO": 388.0, "CoD MW2": 80.0, "Cyberpunk": 81.0, "F1 22": 187.0, "RDR2": 114.0},
  },
  "Intel Core i5-11400": {
    "r1080": {"AC Valhalla": 109.0, "Battlefield V": 150.0, "CS:GO": 412.0, "Cyberpunk": 76.0, "GTA V": 148.0, "R6 Siege": 335.0, "RDR2": 119.0},
    "r4k": {"AC Valhalla": 62.0, "Battlefield V": 110.0, "CS:GO": 319.0, "Cyberpunk": 44.0, "GTA V": 131.0, "RDR2": 75.0},
  },
  "Intel Core i5-12400f": {
    "r1080": {"AC Valhalla": 115.0, "Battlefield V": 197.0, "CS:GO": 539.0, "Cyberpunk": 107.0, "GTA V": 174.0, "R6 Siege": 415.0, "RDR2": 133.0},
    "r4k": {"AC Valhalla": 66.0, "Battlefield V": 117.0, "CS:GO": 379.0, "Cyberpunk": 44.0, "GTA V": 146.0, "RDR2": 77.0},
  },
  "Intel Core i5-12600K": {
    "r1080": {"AC Valhalla": 174.0, "BG3": 138.0, "CoD MW2I": 244.0, "Cyberpunk PL": 96.0, "F1 23": 260.0},
  },
  "Intel Core i5-13400": {
    "r1080": {"AC Valhalla": 151.0, "CS:GO": 568.0, "CoD MW2": 154.0, "Cyberpunk": 133.0, "F1 22": 216.0, "R6 Siege": 412.0, "RDR2": 140.0},
    "r4k": {"AC Valhalla": 124.0, "CS:GO": 423.0, "CoD MW2": 130.0, "Cyberpunk": 81.0, "F1 22": 192.0, "RDR2": 119.0},
  },
  "Intel Core i5-13600K": {
    "r1080": {"AC Valhalla": 185.0, "CS:GO": 764.0, "CoD MW2": 229.0, "Cyberpunk": 161.0, "F1 22": 287.0, "R6 Siege": 512.0, "RDR2": 171.0},
    "r4k": {"AC Valhalla": 126.0, "CS:GO": 482.0, "CoD MW2": 131.0, "Cyberpunk": 77.0, "F1 22": 206.0, "RDR2": 121.0},
  },
  "Intel Core i5-14600K (24H2)": {
    "r1080": {"AC Valhalla": 228.0, "BG3": 181.0, "CS2": 619.0, "CoD MW2I": 283.0, "Cyberpunk PL": 117.0, "F1 23": 366.0},
  },
  "Intel Core i7-13700K": {
    "r1080": {"AC Valhalla": 207.0, "CS:GO": 804.0, "CoD MW2": 234.0, "Cyberpunk": 164.0, "F1 22": 318.0, "R6 Siege": 588.0, "RDR2": 177.0},
    "r4k": {"AC Valhalla": 125.0, "CS:GO": 489.0, "CoD MW2": 132.0, "Cyberpunk": 77.0, "F1 22": 210.0, "RDR2": 122.0},
  },
  "Intel Core i9-12900K": {
    "r1080": {"AC Valhalla": 186.0, "CS:GO": 760.0, "CoD MW2": 229.0, "Cyberpunk": 148.0, "F1 22": 284.0, "R6 Siege": 596.0, "RDR2": 162.0},
    "r4k": {"AC Valhalla": 124.0, "CS:GO": 481.0, "CoD MW2": 132.0, "Cyberpunk": 77.0, "F1 22": 206.0, "RDR2": 121.0},
  },
};

// ── CPU SYNTHETIC BENCHMARKS ────────────────────────────────────
const CS = {
  "AMD Ryzen 5 5500": {"3DMark": 30895.0, "7-Zip": 59727.0, "CPU-Z Bench": 4551.0, "CineBENCH": 10322.0, "WinRAR": 19643.0},
  "AMD Ryzen 5 5500X3D": {"3DMark": 55692.0, "7-Zip": 66434.0, "CPU-Z Bench": 4222.0, "CineBENCH": 10084.0, "WinRAR": 31457.0},
  "AMD Ryzen 5 5600": {"3DMark": 30895.0, "7-Zip": 67538.0, "CineBENCH": 11117.0, "WinRAR": 26529.0},
  "AMD Ryzen 5 5600G": {"3DMark": 31263.0, "7-Zip": 61503.0, "WinRAR": 21199.0},
  "AMD Ryzen 5 5600X": {"3DMark": 33880.0, "7-Zip": 68460.0, "CineBENCH": 11422.0, "WinRAR": 27031.0},
  "AMD Ryzen 5 7600": {"3DMark": 48982.0, "7-Zip": 85995.0, "CineBENCH": 13589.0, "WinRAR": 29296.0},
  "AMD Ryzen 5 7600X": {"3DMark": 50787.0, "7-Zip": 97420.0, "CineBENCH": 15208.0, "WinRAR": 33139.0},
  "AMD Ryzen 5 9600X": {"3DMark": 51479.0, "7-Zip": 95846.0, "CPU-Z Bench": 6469.0, "CineBENCH": 15242.0, "WinRAR": 32155.0},
  "AMD Ryzen 7 5700X": {"3DMark": 48371.0, "7-Zip": 76169.0, "CPU-Z Bench": 6026.0, "CineBENCH": 13474.0, "WinRAR": 30676.0},
  "AMD Ryzen 7 5700X3D": {"3DMark": 48160.0, "7-Zip": 83206.0, "CPU-Z Bench": 5725.0, "CineBENCH": 13798.0, "WinRAR": 35068.0},
  "AMD Ryzen 7 5800X3D": {"3DMark": 51633.0, "7-Zip": 84604.0, "CineBENCH": 14738.0, "WinRAR": 45150.0},
  "AMD Ryzen 7 7700": {"3DMark": 53586.0, "7-Zip": 111238.0, "CineBENCH": 18262.0, "WinRAR": 37664.0},
  "AMD Ryzen 7 7700X": {"3DMark": 53925.0, "7-Zip": 113615.0, "CineBENCH": 19418.0, "WinRAR": 37947.0},
  "AMD Ryzen 7 7800X3D": {"3DMark": 54087.0, "7-Zip": 120196.0, "CPU-Z Bench": 7288.0, "CineBENCH": 17230.0, "WinRAR": 50595.0},
  "AMD Ryzen 7 9800X3D (24H2)": {"3DMark": 58043.0, "7-Zip": 134997.0, "CPU-Z Bench": 8701.0, "CineBENCH": 21982.0, "WinRAR": 55249.0},
  "AMD Ryzen 9 5900X": {"3DMark": 51633.0, "7-Zip": 84604.0, "CineBENCH": 21138.0, "WinRAR": 45150.0},
  "AMD Ryzen 9 7900": {"3DMark": 50507.0, "7-Zip": 141312.0, "CineBENCH": 24736.0, "WinRAR": 47977.0},
  "Intel Core Ultra 5 245K": {"3DMark": 47957.0, "7-Zip": 116943.0, "CPU-Z Bench": 10633.0, "CineBENCH": 24534.0, "WinRAR": 24518.0},
  "Intel Core i3-10100": {"3DMark": 23253.0, "7-Zip": 30958.0, "CineBENCH": 5625.0, "WinRAR": 10222.0},
  "Intel Core i3-12100F": {"3DMark": 28925.0, "7-Zip": 47313.0, "CineBENCH": 8491.0, "WinRAR": 11823.0},
  "Intel Core i3-13100": {"3DMark": 33669.0, "7-Zip": 45526.0, "CineBENCH": 8777.0, "WinRAR": 11605.0},
  "Intel Core i5-11400": {"3DMark": 27827.0, "7-Zip": 46415.0, "CineBENCH": 7374.0, "WinRAR": 14456.0},
  "Intel Core i5-12400f": {"3DMark": 31926.0, "7-Zip": 68207.0, "CineBENCH": 12343.0, "WinRAR": 19065.0},
  "Intel Core i5-12600K": {"3DMark": 40176.0, "7-Zip": 69730.0, "CPU-Z Bench": 7083.0, "CineBENCH": 850.0, "WinRAR": 22270.0},
  "Intel Core i5-13400": {"3DMark": 37484.0, "7-Zip": 82706.0, "CineBENCH": 15851.0, "WinRAR": 20459.0},
  "Intel Core i5-13600K": {"3DMark": 49563.0, "7-Zip": 127566.0, "CineBENCH": 24077.0, "WinRAR": 32754.0},
  "Intel Core i5-14600K (24H2)": {"3DMark": 47158.0, "7-Zip": 124861.0, "CPU-Z Bench": 10159.0, "CineBENCH": 1378.0, "WinRAR": 32861.0},
  "Intel Core i7-13700K": {"3DMark": 53882.0, "7-Zip": 149521.0, "CineBENCH": 30029.0, "WinRAR": 41907.0},
  "Intel Core i9-12900K": {"3DMark": 51015.0, "7-Zip": 127332.0, "CineBENCH": 27287.0, "WinRAR": 33366.0},
};

// ── CPU PRODUCTIVITY ─────────────────────────────────────────────
const CP = {
  "AMD Ryzen 5 5500": {"AIDA64": 68.8, "Adobe Premiere Pro": 792.0, "Blender": 241.0, "V-Ray Benchmark": 7225.0, "x264 FULL HD": 53.04},
  "AMD Ryzen 5 5500X3D": {"Blender": 144.0, "V-Ray Benchmark": 7622.0},
  "AMD Ryzen 5 5600": {"AIDA64": 65.7, "Adobe Premiere Pro": 730.0, "Blender": 218.0, "V-Ray Benchmark": 8238.0, "x264 FULL HD": 57.45},
  "AMD Ryzen 5 5600G": {"AIDA64": 62.4, "Adobe Premiere Pro": 782.0, "Blender": 230.0, "V-Ray Benchmark": 7639.0, "x264 FULL HD": 56.7},
  "AMD Ryzen 5 5600X": {"AIDA64": 65.0, "Adobe Premiere Pro": 725.0, "Blender": 218.0, "V-Ray Benchmark": 8673.0, "x264 FULL HD": 59.5},
  "AMD Ryzen 5 7600": {"AIDA64": 74.4, "Blender": 188.0, "V-Ray Benchmark": 10110.0, "x264 FULL HD": 69.19},
  "AMD Ryzen 5 7600X": {"AIDA64": 65.6, "Blender": 167.0, "V-Ray Benchmark": 11569.0, "x264 FULL HD": 77.4},
  "AMD Ryzen 5 9600X": {"Blender": 222.0, "V-Ray Benchmark": 12622.0},
  "AMD Ryzen 7 5700X": {"AIDA64": 64.3, "Blender": 192.0, "V-Ray Benchmark": 9859.0, "x264 FULL HD": 63.59},
  "AMD Ryzen 7 5700X3D": {"Blender": 190.0, "V-Ray Benchmark": 10273.0},
  "AMD Ryzen 7 5800X3D": {"AIDA64": 68.8, "Blender": 169.0, "V-Ray Benchmark": 11273.0, "x264 FULL HD": 69.2},
  "AMD Ryzen 7 7700": {"AIDA64": 72.2, "Blender": 135.0, "V-Ray Benchmark": 14065.0, "x264 FULL HD": 81.13},
  "AMD Ryzen 7 7700X": {"Blender": 128.0, "V-Ray Benchmark": 14765.0, "x264 FULL HD": 85.64},
  "AMD Ryzen 7 7800X3D": {"Blender": 262.0, "V-Ray Benchmark": 14271.0},
  "AMD Ryzen 7 9800X3D (24H2)": {"Blender": 326.0, "V-Ray Benchmark": 18010.0},
  "AMD Ryzen 9 5900X": {"Blender": 117.0, "V-Ray Benchmark": 16197.0, "x264 FULL HD": 83.69},
  "AMD Ryzen 9 7900": {"Blender": 100.0, "V-Ray Benchmark": 19136.0, "x264 FULL HD": 92.98},
  "Intel Core Ultra 5 245K": {"Blender": 315.0, "V-Ray Benchmark": 17398.0},
  "Intel Core i3-10100": {"AIDA64": 59.1, "Adobe Premiere Pro": 1246.0, "Blender": 394.0, "V-Ray Benchmark": 4022.0, "x264 FULL HD": 29.8},
  "Intel Core i3-12100F": {"AIDA64": 81.0, "Adobe Premiere Pro": 830.0, "Blender": 297.0, "V-Ray Benchmark": 5898.0, "x264 FULL HD": 39.88},
  "Intel Core i3-13100": {"AIDA64": 80.6, "Blender": 299.0, "V-Ray Benchmark": 5948.0, "x264 FULL HD": 40.8},
  "Intel Core i5-11400": {"AIDA64": 66.7, "Adobe Premiere Pro": 975.0, "Blender": 333.0, "V-Ray Benchmark": 5567.0, "x264 FULL HD": 40.3},
  "Intel Core i5-12400f": {"AIDA64": 67.2, "Adobe Premiere Pro": 587.0, "Blender": 206.0, "x264 FULL HD": 56.09},
  "Intel Core i5-12600K": {"Blender": 225.0, "V-Ray Benchmark": 11306.0},
  "Intel Core i5-13400": {"AIDA64": 83.4, "Blender": 163.0, "V-Ray Benchmark": 10603.0, "x264 FULL HD": 72.46},
  "Intel Core i5-13600K": {"AIDA64": 75.0, "Blender": 106.0, "V-Ray Benchmark": 16042.0, "x264 FULL HD": 103.79},
  "Intel Core i5-14600K (24H2)": {"Blender": 304.0, "V-Ray Benchmark": 16226.0},
  "Intel Core i7-13700K": {"Blender": 83.0, "V-Ray Benchmark": 20718.0, "x264 FULL HD": 119.38},
  "Intel Core i9-12900K": {"Blender": 93.0, "V-Ray Benchmark": 18235.0, "x264 FULL HD": 108.7},
};

// ── CPU SPECS ─────────────────────────────────────────────────────
const CSPEC = {
  "AMD Ryzen 5 5500": {"brand": "AMD", "arch": "Zen 3", "socket": "AM4", "cores": "6P", "threads": 12, "base": 3.6, "boost": 4.2, "l3": 16, "tdp": 65, "mem": "DDR4-3200", "launch": "Abr/2022"},
  "AMD Ryzen 5 5500X3D": {"brand": "AMD", "arch": "Zen 3 3D V-Cache", "socket": "AM4", "cores": "6P", "threads": 12, "base": 3.6, "boost": 4.5, "l3": 32, "tdp": 65, "mem": "DDR4-3200", "launch": "Mar/2024"},
  "AMD Ryzen 5 5600": {"brand": "AMD", "arch": "Zen 3", "socket": "AM4", "cores": "6P", "threads": 12, "base": 3.5, "boost": 4.4, "l3": 32, "tdp": 65, "mem": "DDR4-3200", "launch": "Abr/2022"},
  "AMD Ryzen 5 5600G": {"brand": "AMD", "arch": "Zen 3 iGPU", "socket": "AM4", "cores": "6P", "threads": 12, "base": 3.9, "boost": 4.4, "l3": 16, "tdp": 65, "mem": "DDR4-3200", "launch": "Abr/2021"},
  "AMD Ryzen 5 5600X": {"brand": "AMD", "arch": "Zen 3", "socket": "AM4", "cores": "6P", "threads": 12, "base": 3.7, "boost": 4.6, "l3": 32, "tdp": 65, "mem": "DDR4-3200", "launch": "Nov/2020"},
  "AMD Ryzen 5 7600": {"brand": "AMD", "arch": "Zen 4", "socket": "AM5", "cores": "6P", "threads": 12, "base": 3.8, "boost": 5.1, "l3": 32, "tdp": 65, "mem": "DDR5-5200", "launch": "Jan/2023"},
  "AMD Ryzen 5 7600X": {"brand": "AMD", "arch": "Zen 4", "socket": "AM5", "cores": "6P", "threads": 12, "base": 4.7, "boost": 5.3, "l3": 32, "tdp": 105, "mem": "DDR5-5200", "launch": "Set/2022"},
  "AMD Ryzen 5 9600X": {"brand": "AMD", "arch": "Zen 5", "socket": "AM5", "cores": "6P", "threads": 12, "base": 3.9, "boost": 5.4, "l3": 32, "tdp": 65, "mem": "DDR5-5200", "launch": "Jul/2024"},
  "AMD Ryzen 7 5700X": {"brand": "AMD", "arch": "Zen 3", "socket": "AM4", "cores": "8P", "threads": 16, "base": 3.4, "boost": 4.6, "l3": 32, "tdp": 65, "mem": "DDR4-3200", "launch": "Abr/2022"},
  "AMD Ryzen 7 5700X3D": {"brand": "AMD", "arch": "Zen 3 3D V-Cache", "socket": "AM4", "cores": "8P", "threads": 16, "base": 3.0, "boost": 4.1, "l3": 96, "tdp": 105, "mem": "DDR4-3200", "launch": "Mar/2024"},
  "AMD Ryzen 7 5800X3D": {"brand": "AMD", "arch": "Zen 3 3D V-Cache", "socket": "AM4", "cores": "8P", "threads": 16, "base": 3.4, "boost": 4.5, "l3": 96, "tdp": 105, "mem": "DDR4-3200", "launch": "Abr/2022"},
  "AMD Ryzen 7 7700": {"brand": "AMD", "arch": "Zen 4", "socket": "AM5", "cores": "8P", "threads": 16, "base": 3.8, "boost": 5.3, "l3": 32, "tdp": 65, "mem": "DDR5-5200", "launch": "Jan/2023"},
  "AMD Ryzen 7 7700X": {"brand": "AMD", "arch": "Zen 4", "socket": "AM5", "cores": "8P", "threads": 16, "base": 4.5, "boost": 5.4, "l3": 32, "tdp": 105, "mem": "DDR5-5200", "launch": "Set/2022"},
  "AMD Ryzen 7 7800X3D": {"brand": "AMD", "arch": "Zen 4 3D V-Cache", "socket": "AM5", "cores": "8P", "threads": 16, "base": 4.2, "boost": 5.0, "l3": 96, "tdp": 120, "mem": "DDR5-5200", "launch": "Abr/2023"},
  "AMD Ryzen 7 9800X3D (24H2)": {"brand": "AMD", "arch": "Zen 5 3D V-Cache", "socket": "AM5", "cores": "8P", "threads": 16, "base": 4.7, "boost": 5.2, "l3": 96, "tdp": 120, "mem": "DDR5-5200", "launch": "Nov/2024"},
  "AMD Ryzen 9 5900X": {"brand": "AMD", "arch": "Zen 3", "socket": "AM4", "cores": "12P", "threads": 24, "base": 3.7, "boost": 4.8, "l3": 64, "tdp": 105, "mem": "DDR4-3200", "launch": "Nov/2020"},
  "AMD Ryzen 9 7900": {"brand": "AMD", "arch": "Zen 4", "socket": "AM5", "cores": "12P", "threads": 24, "base": 3.7, "boost": 5.4, "l3": 64, "tdp": 65, "mem": "DDR5-5200", "launch": "Jan/2023"},
  "Intel Core Ultra 5 245K": {"brand": "Intel", "arch": "Arrow Lake", "socket": "LGA1851", "cores": "6P+8E", "threads": 20, "base": 3.6, "boost": 5.2, "l3": 24, "tdp": 125, "mem": "DDR5-6400", "launch": "Out/2024"},
  "Intel Core i3-10100": {"brand": "Intel", "arch": "Comet Lake", "socket": "LGA1200", "cores": "4P", "threads": 8, "base": 3.6, "boost": 4.3, "l3": 6, "tdp": 65, "mem": "DDR4-2666", "launch": "Mai/2020"},
  "Intel Core i3-12100F": {"brand": "Intel", "arch": "Alder Lake", "socket": "LGA1700", "cores": "4P", "threads": 8, "base": 3.3, "boost": 4.3, "l3": 12, "tdp": 58, "mem": "DDR5-4800", "launch": "Jan/2022"},
  "Intel Core i3-13100": {"brand": "Intel", "arch": "Raptor Lake", "socket": "LGA1700", "cores": "4P", "threads": 8, "base": 3.4, "boost": 4.5, "l3": 12, "tdp": 60, "mem": "DDR5-4800", "launch": "Jan/2023"},
  "Intel Core i5-11400": {"brand": "Intel", "arch": "Rocket Lake", "socket": "LGA1200", "cores": "6P", "threads": 12, "base": 2.6, "boost": 4.4, "l3": 12, "tdp": 65, "mem": "DDR4-3200", "launch": "Mar/2021"},
  "Intel Core i5-12400f": {"brand": "Intel", "arch": "Alder Lake", "socket": "LGA1700", "cores": "6P", "threads": 12, "base": 2.5, "boost": 4.4, "l3": 18, "tdp": 65, "mem": "DDR5-4800", "launch": "Jan/2022"},
  "Intel Core i5-12600K": {"brand": "Intel", "arch": "Alder Lake", "socket": "LGA1700", "cores": "6P+4E", "threads": 16, "base": 3.7, "boost": 4.9, "l3": 20, "tdp": 125, "mem": "DDR5-4800", "launch": "Nov/2021"},
  "Intel Core i5-13400": {"brand": "Intel", "arch": "Raptor Lake", "socket": "LGA1700", "cores": "6P+4E", "threads": 16, "base": 2.5, "boost": 4.6, "l3": 20, "tdp": 65, "mem": "DDR5-4800", "launch": "Jan/2023"},
  "Intel Core i5-13600K": {"brand": "Intel", "arch": "Raptor Lake", "socket": "LGA1700", "cores": "6P+8E", "threads": 20, "base": 3.5, "boost": 5.1, "l3": 24, "tdp": 125, "mem": "DDR5-5600", "launch": "Out/2022"},
  "Intel Core i5-14600K (24H2)": {"brand": "Intel", "arch": "Raptor Lake R.", "socket": "LGA1700", "cores": "6P+8E", "threads": 20, "base": 3.5, "boost": 5.3, "l3": 24, "tdp": 125, "mem": "DDR5-5600", "launch": "Out/2023"},
  "Intel Core i7-13700K": {"brand": "Intel", "arch": "Raptor Lake", "socket": "LGA1700", "cores": "8P+8E", "threads": 24, "base": 3.4, "boost": 5.4, "l3": 30, "tdp": 125, "mem": "DDR5-5600", "launch": "Out/2022"},
  "Intel Core i9-12900K": {"brand": "Intel", "arch": "Alder Lake", "socket": "LGA1700", "cores": "8P+8E", "threads": 24, "base": 3.2, "boost": 5.2, "l3": 30, "tdp": 125, "mem": "DDR5-4800", "launch": "Nov/2021"},
};

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const POS   = ["#00e5ff","#a855f7","#f59e0b","#ec4899","#22c55e"]
const BRAND = { NVIDIA:"#76b900", AMD:"#ef4444", Intel:"#3b82f6" }
function bc(b){ return BRAND[b]||"#888" }
function avg(o){
  const v = Object.values(o||{}).filter(x=>x!=null&&!isNaN(x))
  return v.length ? v.reduce((a,c)=>a+c,0)/v.length : 0
}
function sn(n){ return String(n).replace("GeForce ","").replace("Radeon RX ","RX ").replace("Radeon ","").replace("Intel Core ","") }

const GL = Object.keys(GG).map(n=>({name:n, ...(GS[n]||{brand:"NVIDIA",tdp:200})}))
const CL = Object.keys(CG).map(n=>({name:n, ...(CSPEC[n]||{brand:"AMD",tdp:65})}))
const DG = ["RTX 5090 32 GB","RTX 4090 24 GB","RX 7900 XTX 24 GB","RTX 5070 12 GB"]
const DC = ["AMD Ryzen 7 9800X3D (24H2)","AMD Ryzen 7 5800X3D","Intel Core i5-13600K","AMD Ryzen 5 7600"]

// ── TOOLTIP ────────────────────────────────────────────────────────────────
const Tip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null
  return (
    <div style={{background:"#0f0f18",border:"1px solid #00e5ff22",borderRadius:8,
      padding:"10px 14px",fontSize:11,maxWidth:300,boxShadow:"0 8px 32px #000c"}}>
      <p style={{color:"#00e5ff",fontWeight:700,marginBottom:6,fontSize:12}}>{label}</p>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:p.color,flexShrink:0}}/>
          <span style={{color:"#aaa",flex:1,overflow:"hidden",textOverflow:"ellipsis",
            whiteSpace:"nowrap",fontSize:10}}>{sn(p.name)}</span>
          <span style={{color:"#fff",fontWeight:700,fontSize:11}}>
            {typeof p.value==="number"?p.value.toFixed(p.value>100?0:1):p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function HardwareBR() {
  const [mode,setMode]   = useState("gpu")
  const [sel,setSel]     = useState(DG)
  const [tab,setTab]     = useState("specs")
  const [q,setQ]         = useState("")
  const [open,setOpen]   = useState(false)
  const [gpgFilter,setGpgFilter] = useState("all")

  const list  = mode==="gpu" ? GL : CL
  const gdata = mode==="gpu" ? GG : CG

  const items = useMemo(()=>sel.map(n=>list.find(x=>x.name===n)).filter(Boolean),[sel,list])
  const filt  = useMemo(()=>{
    let l = list.filter(x=>!sel.includes(x.name))
    if(q) l = l.filter(x=>x.name.toLowerCase().includes(q.toLowerCase()))
    if(mode==="gpu" && gpgFilter!=="all") l = l.filter(x=>x.brand===gpgFilter)
    return l
  },[list,q,sel,mode,gpgFilter])

  const sw = useCallback(m=>{
    setMode(m); setSel(m==="gpu"?DG:DC); setTab("specs"); setQ(""); setOpen(false)
  },[])

  const rm  = n => setSel(s=>s.filter(x=>x!==n))
  const add = n => { setSel(s=>s.length<5&&!s.includes(n)?[...s,n]:s); setOpen(false); setQ("") }

  // ── DATA BUILDERS ────────────────────────────────────────────────────────
  const buildGame = rk => {
    const games = new Set()
    items.forEach(it=>{const d=gdata[it.name]?.[rk]; if(d) Object.keys(d).forEach(g=>games.add(g))})
    return Array.from(games).sort().map(g=>{
      const row={game:g.length>28?g.slice(0,26)+"…":g}
      items.forEach(it=>{row[it.name]=gdata[it.name]?.[rk]?.[g]||null})
      return row
    }).filter(r=>items.some(it=>r[it.name]))
  }

  const buildSynth = () => {
    const tests = new Set()
    items.forEach(it=>{const d=CS[it.name]; if(d) Object.keys(d).forEach(t=>tests.add(t))})
    return Array.from(tests).map(t=>{
      const row={test:t}
      items.forEach(it=>{row[it.name]=CS[it.name]?.[t]||null})
      return row
    }).filter(r=>items.some(it=>r[it.name]))
  }

  const buildProd = () => {
    const tests = new Set()
    items.forEach(it=>{const d=CP[it.name]; if(d) Object.keys(d).forEach(t=>tests.add(t))})
    return Array.from(tests).map(t=>{
      const row={test:t}
      items.forEach(it=>{row[it.name]=CP[it.name]?.[t]||null})
      return row
    }).filter(r=>items.some(it=>r[it.name]))
  }

  const buildRadar = () => {
    const axes = mode==="gpu"
      ? ["Raster 1080p","4K","VRAM","Efic./Watt","Clock Boost"]
      : ["Gaming 1080p","Gaming 4K","Sintético","Produção","Efic./Watt"]
    const vals = {}
    items.forEach(it=>{
      if(mode==="gpu"){
        const g=avg(GG[it.name]?.r1080), g4=avg(GG[it.name]?.r4k)
        vals[it.name]=[g,g4,parseFloat(it.vram)||8,g/(it.tdp||200),it.boost||2000]
      } else {
        const g=avg(CG[it.name]?.r1080), g4=avg(CG[it.name]?.r4k)
        const s=avg(CS[it.name]), p=avg(CP[it.name])
        vals[it.name]=[g,g4,s,p,(g+g4)/(it.tdp||65)]
      }
    })
    const mx = axes.map((_,i)=>Math.max(...items.map(it=>vals[it.name]?.[i]||0))||1)
    return axes.map((subject,i)=>{
      const row={subject}
      items.forEach(it=>{ row[it.name]=mx[i]?Math.round(((vals[it.name]?.[i]||0)/mx[i])*100):0 })
      return row
    })
  }

  // ── SPEC ROWS ────────────────────────────────────────────────────────────
  const SR = mode==="gpu" ? [
    {k:"arch",l:"Arquitetura"},{k:"proc",l:"Processo (nm)"},
    {k:"vram",l:"VRAM"},{k:"bus",l:"Barramento"},
    {k:"bw",l:"Bw Memória (GB/s)",n:1},{k:"boost",l:"Boost (MHz)",n:1},
    {k:"shaders",l:"Shaders/CUDA",n:1},{k:"tdp",l:"TDP (W)",n:1,lo:1},
    {k:"launch",l:"Lançamento"},
  ] : [
    {k:"arch",l:"Arquitetura"},{k:"socket",l:"Socket"},
    {k:"cores",l:"Núcleos"},{k:"threads",l:"Threads",n:1},
    {k:"base",l:"Base (GHz)",n:1},{k:"boost",l:"Boost (GHz)",n:1},
    {k:"l3",l:"Cache L3 (MB)",n:1},{k:"tdp",l:"TDP (W)",n:1,lo:1},
    {k:"mem",l:"Memória"},{k:"launch",l:"Lançamento"},
  ]

  const TABS = [
    {id:"specs",label:"Specs",icon:<Settings size={13}/>},
    {id:"r1080",label:"1080p",icon:<Gamepad2 size={13}/>},
    {id:"r1440",label:"1440p",icon:<Monitor size={13}/>},
    {id:"r4k",label:"4K",icon:<Zap size={13}/>},
    {id:"bench",label:"Benchmark",icon:<BarChart2 size={13}/>},
    {id:"prod",label:"Produção",icon:<Film size={13}/>},
  ]

  // ── RENDER HELPERS ────────────────────────────────────────────────────────
  const GameChart = ({data}) => {
    if(!data.length) return <p style={{color:"#444",padding:"30px 0",textAlign:"center"}}>Sem dados para esta resolução</p>
    const h = Math.max(280, data.length * 22 + 60)
    return (
      <div>
        <div style={{height:h}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{left:5,right:24,top:5,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05"/>
              <XAxis type="number" tick={{fill:"#555",fontSize:10}} unit=" fps" axisLine={{stroke:"#1a1a28"}} tickLine={false}/>
              <YAxis dataKey="game" type="category" tick={{fill:"#888",fontSize:10}} width={125} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Legend wrapperStyle={{fontSize:10,paddingTop:8}} formatter={v=>sn(v)}/>
              {items.map((it,i)=>(
                <Bar key={it.name} dataKey={it.name} fill={POS[i]} radius={[0,3,3,0]}
                  maxBarSize={13} animationDuration={350}/>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8,marginTop:14}}>
          {data.slice(0,12).map(row=>{
            const vals = items.map((it,i)=>({n:it.name,fps:row[it.name]||0,c:POS[i]}))
              .filter(x=>x.fps>0).sort((a,b)=>b.fps-a.fps)
            const mx = vals[0]?.fps||1
            return (
              <div key={row.game} style={{background:"#0b0b15",borderRadius:6,
                padding:"9px 11px",border:"1px solid #1a1a28"}}>
                <p style={{color:"#e0e0e0",fontWeight:700,fontSize:11,marginBottom:7}}>{row.game}</p>
                {vals.map((v,i)=>(
                  <div key={v.n} style={{marginBottom:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:9,color:"#777",overflow:"hidden",textOverflow:"ellipsis",
                        whiteSpace:"nowrap",maxWidth:"58%"}}>{sn(v.n)}</span>
                      <span style={{fontSize:11,fontWeight:700,color:i===0?"#ff6b1a":v.c}}>
                        {v.fps}{i===0?" 🏆":""}
                      </span>
                    </div>
                    <div style={{height:3,background:"#181828",borderRadius:2}}>
                      <div style={{height:"100%",width:`${(v.fps/mx)*100}%`,
                        background:v.c,borderRadius:2,transition:"width .4s ease"}}/>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderSpecs = () => (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:400}}>
        <thead>
          <tr style={{background:"#0b0b15"}}>
            <th style={{textAlign:"left",padding:"9px 12px",color:"#444",
              borderBottom:"1px solid #1a1a28",minWidth:130,position:"sticky",left:0,background:"#0b0b15"}}>
              Especificação
            </th>
            {items.map((it,i)=>(
              <th key={it.name} style={{padding:"9px 12px",color:POS[i],textAlign:"center",
                borderBottom:"1px solid #1a1a28",minWidth:145}}>
                <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"center"}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:bc(it.brand)}}/>
                  <span style={{fontSize:11,fontWeight:700,lineHeight:1.3}}>{sn(it.name)}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SR.map((row,ri)=>{
            const vals = items.map(it=>it[row.k])
            const nums = vals.filter(v=>typeof v==="number"&&!isNaN(v))
            const best = nums.length ? (row.lo?Math.min(...nums):Math.max(...nums)) : null
            return (
              <tr key={row.k} style={{background:ri%2===0?"#09090f":"#0b0b15"}}>
                <td style={{padding:"8px 12px",color:"#555",fontSize:11,
                  borderBottom:"1px solid #111120",position:"sticky",left:0,
                  background:ri%2===0?"#09090f":"#0b0b15"}}>{row.l}</td>
                {items.map((it,i)=>{
                  const v=it[row.k]; const ok=typeof v==="number"&&v===best
                  return (
                    <td key={it.name} style={{padding:"8px 12px",textAlign:"center",
                      borderBottom:"1px solid #111120",fontSize:11,
                      color:ok?"#00e5ff":"#ccc",fontWeight:ok?700:400,
                      background:ok?"rgba(0,229,255,0.04)":""}}>
                      {v!=null?(typeof v==="number"?v.toLocaleString("pt-BR"):v):"—"}{ok?" ✓":""}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  const renderBench = () => {
    const radar = buildRadar()
    const synth = buildSynth()
    return (
      <div>
        {radar.length>0 && (
          <div style={{marginBottom:24}}>
            <p style={{color:"#444",fontSize:11,marginBottom:8,letterSpacing:1}}>
              PERFIL DE DESEMPENHO — escala relativa 0–100
            </p>
            <div style={{height:280}}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radar}>
                  <PolarGrid stroke="#1a1a28"/>
                  <PolarAngleAxis dataKey="subject" tick={{fill:"#777",fontSize:11}}/>
                  <PolarRadiusAxis angle={30} domain={[0,100]} tick={{fill:"#2a2a3a",fontSize:8}}/>
                  {items.map((it,i)=>(
                    <Radar key={it.name} name={sn(it.name)} dataKey={it.name}
                      stroke={POS[i]} fill={POS[i]} fillOpacity={0.1}/>
                  ))}
                  <Legend wrapperStyle={{fontSize:10}}/>
                  <Tooltip content={<Tip/>}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {synth.length>0 ? (
          <div>
            <p style={{color:"#444",fontSize:11,marginBottom:8,letterSpacing:1}}>
              BENCHMARKS SINTÉTICOS — dados reais
            </p>
            <div style={{height:Math.max(200,synth.length*44+60)}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={synth} layout="vertical" margin={{left:5,right:24,top:5,bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05"/>
                  <XAxis type="number" tick={{fill:"#555",fontSize:10}} axisLine={{stroke:"#1a1a28"}} tickLine={false}/>
                  <YAxis dataKey="test" type="category" tick={{fill:"#888",fontSize:10}}
                    width={115} axisLine={false} tickLine={false}/>
                  <Tooltip content={<Tip/>}/>
                  <Legend wrapperStyle={{fontSize:10}} formatter={v=>sn(v)}/>
                  {items.map((it,i)=>(
                    <Bar key={it.name} dataKey={it.name} fill={POS[i]} radius={[0,3,3,0]} maxBarSize={18}/>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : mode==="gpu" ? (
          <div style={{textAlign:"center",padding:"40px 20px",color:"#333"}}>
            <BarChart2 size={32} style={{margin:"0 auto 10px"}}/>
            <p>Benchmarks sintéticos de GPU em breve</p>
          </div>
        ) : null}
      </div>
    )
  }

  const renderProd = () => {
    const rows = buildProd()
    if(!rows.length) return (
      <div style={{textAlign:"center",padding:"40px 20px",color:"#333"}}>
        <Film size={32} style={{margin:"0 auto 10px"}}/>
        <p>Dados de produção disponíveis para CPUs</p>
        <p style={{fontSize:11,color:"#2a2a3a",marginTop:4}}>Blender · V-Ray · x264 · Adobe Premiere · AIDA64</p>
      </div>
    )
    return (
      <div>
        <p style={{color:"#444",fontSize:11,marginBottom:12,letterSpacing:1}}>
          WORKLOADS CRIATIVOS — Blender: segundos ↓ · V-Ray: pontos ↑ · x264: fps ↑ · Premiere: segundos ↓
        </p>
        <div style={{height:Math.max(220,rows.length*46+60)}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical" margin={{left:5,right:24,top:5,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05"/>
              <XAxis type="number" tick={{fill:"#555",fontSize:10}} axisLine={{stroke:"#1a1a28"}} tickLine={false}/>
              <YAxis dataKey="test" type="category" tick={{fill:"#888",fontSize:10}}
                width={130} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tip/>}/>
              <Legend wrapperStyle={{fontSize:10}} formatter={v=>sn(v)}/>
              {items.map((it,i)=>(
                <Bar key={it.name} dataKey={it.name} fill={POS[i]} radius={[0,3,3,0]} maxBarSize={18}/>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:"#07070e",minHeight:"100vh",
      fontFamily:"'Rajdhani','Barlow Condensed','Segoe UI',sans-serif",color:"#e0e0e0"}}>

      {/* HEADER */}
      <div style={{background:"#0b0b18",borderBottom:"1px solid #1a1a28",
        padding:"13px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Cpu size={26} color="#00e5ff" strokeWidth={1.5}/>
          <div>
            <h1 style={{fontSize:20,fontWeight:700,color:"#fff",letterSpacing:2,lineHeight:1,margin:0}}>
              HardwareBR
            </h1>
            <p style={{fontSize:9,color:"#00e5ff",letterSpacing:4,margin:0,opacity:.8}}>
              COMPARADOR DE HARDWARE
            </p>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginLeft:"auto"}}>
          {["gpu","cpu"].map(m=>(
            <button key={m} onClick={()=>sw(m)} style={{
              padding:"7px 20px",borderRadius:4,fontWeight:700,fontSize:13,letterSpacing:1,
              cursor:"pointer",transition:"all .15s",
              background:mode===m?"#00e5ff":"transparent",
              color:mode===m?"#000":"#666",
              border:`1px solid ${mode===m?"#00e5ff":"#2a2a3a"}`}}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>
        <p style={{fontSize:10,color:"#333",width:"100%",margin:0,letterSpacing:.5}}>
          {mode==="gpu"
            ? "52 GPUs · 39 jogos · 1080p / 1440p / 4K · dados reais TechPowerUp"
            : "29 CPUs · gaming · CineBENCH · 7-Zip · 3DMark · Blender · V-Ray · Adobe Premiere · dados reais"}
        </p>
      </div>

      <div style={{padding:"16px 20px 48px"}}>

        {/* SELECTOR */}
        <div style={{background:"#0b0b18",borderRadius:8,padding:12,
          marginBottom:16,border:"1px solid #1a1a28"}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>

            {/* Selected badges */}
            {items.map((it,i)=>(
              <div key={it.name} style={{display:"flex",alignItems:"center",gap:6,
                background:"#161622",border:`1px solid ${POS[i]}33`,
                borderRadius:4,padding:"5px 8px",boxShadow:`0 0 8px ${POS[i]}14`}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:POS[i],flexShrink:0}}/>
                <span style={{fontSize:10,fontWeight:700,color:"#fff",
                  background:bc(it.brand),padding:"1px 5px",borderRadius:2}}>
                  {it.brand[0]}
                </span>
                <span style={{fontSize:11,color:"#ddd",maxWidth:160,overflow:"hidden",
                  textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sn(it.name)}</span>
                <button onClick={()=>rm(it.name)} style={{background:"none",border:"none",
                  color:"#444",cursor:"pointer",padding:0,flexShrink:0,lineHeight:1}}>
                  <X size={11}/>
                </button>
              </div>
            ))}

            {/* Add dropdown */}
            {sel.length<5 && (
              <div style={{position:"relative"}}>
                <button onClick={()=>setOpen(v=>!v)} style={{
                  display:"flex",alignItems:"center",gap:5,
                  background:"#161622",border:"1px dashed #2a2a3a",
                  borderRadius:4,padding:"5px 10px",cursor:"pointer",
                  color:"#00e5ff",fontSize:11}}>
                  <Plus size={12}/>Adicionar {mode.toUpperCase()}
                </button>
                {open && (
                  <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:200,
                    background:"#0f0f1c",border:"1px solid #2a2a3a",borderRadius:7,
                    width:310,maxHeight:340,overflow:"hidden",
                    boxShadow:"0 12px 48px rgba(0,0,0,.8)"}}>

                    {/* Search */}
                    <div style={{padding:"8px 10px",borderBottom:"1px solid #1a1a28",
                      display:"flex",alignItems:"center",gap:7}}>
                      <Search size={13} color="#444"/>
                      <input value={q} onChange={e=>setQ(e.target.value)}
                        placeholder={`Buscar ${mode.toUpperCase()}...`}
                        style={{background:"none",border:"none",color:"#fff",
                          fontSize:12,outline:"none",flex:1}} autoFocus/>
                    </div>

                    {/* Brand filter (GPU only) */}
                    {mode==="gpu" && (
                      <div style={{padding:"6px 10px",borderBottom:"1px solid #1a1a28",
                        display:"flex",gap:5}}>
                        {["all","NVIDIA","AMD","Intel"].map(b=>(
                          <button key={b} onClick={()=>setGpgFilter(b)} style={{
                            padding:"2px 8px",fontSize:10,borderRadius:3,cursor:"pointer",
                            background:gpgFilter===b?"#00e5ff":"#1a1a28",
                            color:gpgFilter===b?"#000":"#888",border:"none",fontWeight:gpgFilter===b?700:400}}>
                            {b==="all"?"Todas":b}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* List */}
                    <div style={{overflowY:"auto",maxHeight:250}}>
                      {filt.map(it=>(
                        <button key={it.name} onClick={()=>add(it.name)} style={{
                          display:"flex",alignItems:"center",gap:7,width:"100%",
                          padding:"7px 10px",background:"none",border:"none",
                          color:"#ccc",cursor:"pointer",textAlign:"left",fontSize:11,
                          borderBottom:"1px solid #111120"}}
                          onMouseEnter={e=>e.currentTarget.style.background="#1a1a28"}
                          onMouseLeave={e=>e.currentTarget.style.background="none"}>
                          <span style={{width:7,height:7,borderRadius:"50%",
                            background:bc(it.brand),flexShrink:0}}/>
                          <span style={{background:bc(it.brand),color:"#fff",fontSize:9,
                            padding:"1px 4px",borderRadius:2,fontWeight:700,flexShrink:0}}>
                            {it.brand}
                          </span>
                          {it.name}
                        </button>
                      ))}
                      {!filt.length && <p style={{padding:12,color:"#333",fontSize:11}}>Nenhum resultado</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{marginLeft:"auto",display:"flex",gap:6}}>
              <button onClick={()=>{setSel(mode==="gpu"?DG:DC);setOpen(false)}} style={{
                padding:"5px 10px",fontSize:10,background:"none",
                border:"1px solid #1e1e28",borderRadius:4,color:"#555",cursor:"pointer",
                display:"flex",alignItems:"center",gap:4}}>
                <TrendingUp size={11}/>Popular
              </button>
              {sel.length>0 && (
                <button onClick={()=>setSel([])} style={{
                  padding:"5px 10px",fontSize:10,background:"none",
                  border:"1px solid #1e1e28",borderRadius:4,color:"#555",cursor:"pointer",
                  display:"flex",alignItems:"center",gap:4}}>
                  <X size={11}/>Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {items.length===0 && (
          <div style={{textAlign:"center",padding:"60px 20px",color:"#333"}}>
            <Cpu size={44} style={{margin:"0 auto 14px",opacity:.15}}/>
            <p style={{fontSize:15,color:"#444"}}>Selecione componentes para comparar</p>
            <p style={{fontSize:11,color:"#2a2a3a",marginTop:4}}>Até 5 simultâneos · {mode==="gpu"?"52 GPUs":"29 CPUs"} disponíveis</p>
          </div>
        )}

        {/* CONTENT */}
        {items.length>0 && (
          <div>
            {/* TABS */}
            <div style={{display:"flex",gap:3,marginBottom:16,background:"#0b0b18",
              padding:3,borderRadius:6,border:"1px solid #1a1a28",
              overflowX:"auto",position:"sticky",top:0,zIndex:20}}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{
                  display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:4,
                  fontWeight:tab===t.id?700:500,fontSize:12,cursor:"pointer",
                  background:tab===t.id?"#00e5ff":"none",
                  color:tab===t.id?"#000":"#666",border:"none",
                  whiteSpace:"nowrap",transition:"all .1s",letterSpacing:.5}}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div style={{background:"#0b0b18",borderRadius:8,padding:16,
              border:"1px solid #1a1a28",minHeight:200}}>
              {tab==="specs" && renderSpecs()}
              {tab==="r1080" && <GameChart data={buildGame("r1080")}/>}
              {tab==="r1440" && <GameChart data={buildGame("r1440")}/>}
              {tab==="r4k"   && <GameChart data={buildGame("r4k")}/>}
              {tab==="bench" && renderBench()}
              {tab==="prod"  && renderProd()}
            </div>

            {/* SUMMARY CARDS */}
            <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
              {items.map((it,i)=>{
                const g  = mode==="gpu"?avg(GG[it.name]?.r1080):avg(CG[it.name]?.r1080)
                const pw = (g/(it.tdp||200)).toFixed(2)
                return (
                  <div key={it.name} style={{flex:"1 1 140px",background:"#0b0b18",
                    borderRadius:6,padding:"10px 12px",borderLeft:`3px solid ${POS[i]}`}}>
                    <p style={{fontSize:9,color:"#444",margin:"0 0 4px",overflow:"hidden",
                      textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sn(it.name)}</p>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                      <div>
                        <p style={{fontSize:9,color:"#333",margin:0}}>FPS méd. 1080p</p>
                        <p style={{fontSize:20,fontWeight:700,color:POS[i],margin:0,lineHeight:1}}>
                          {g.toFixed(0)}
                        </p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{fontSize:9,color:"#333",margin:0}}>Perf/Watt</p>
                        <p style={{fontSize:13,fontWeight:600,color:"#666",margin:0}}>{pw}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {open && <div style={{position:"fixed",inset:0,zIndex:190}} onClick={()=>setOpen(false)}/>}
    </div>
  )
}
