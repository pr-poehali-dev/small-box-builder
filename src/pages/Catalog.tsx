import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/shared/Header";
import {
  PriceCalculator,
  PriceCalculatorInitial,
} from "@/components/shared/PriceCalculator";

// ─── Данные каталога ────────────────────────────────────────────────────────

type BuildingTag = "Склад" | "Производство" | "Производственно-складское";

type AreaRange = "до 1000 м²" | "1000–3000 м²" | "свыше 3000 м²";
type HeightRange = "до 5 м" | "5–8 м" | "свыше 8 м";

interface CatalogItem {
  id: string;
  tag: BuildingTag;
  name: string;
  image: string;
  width: number;
  length: number;
  height: number;
  price: number;
  crane: string;
  region: string;
  gates: { count: number; size: string; wicket?: boolean } | null;
  doors: { count: number; size: string }[];
  windows: { count: number; size: string }[];
  stripGlazing?: string;
  popular?: boolean;
}

const CATALOG: CatalogItem[] = [
  {
    id: "1",
    tag: "Склад",
    name: "Склад стеклопластиковых изделий",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/30129fd9-b514-4aac-a522-fb7a7285b25b.jpg",
    width: 12,
    length: 36,
    height: 5,
    price: 7_366_616,
    crane: "Нет",
    region: "Москва",
    stripGlazing: "68 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "2",
    tag: "Производство",
    name: "Производственное здание",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/7ccc2058-0835-490c-a393-eb0bf6d86339.jpg",
    width: 18,
    length: 24,
    height: 6,
    price: 6_822_116,
    crane: "Нет",
    region: "Москва",
    doors: [{ count: 1, size: "1400×2100 мм" }],
    gates: { count: 1, size: "4000×4000 мм", wicket: false },
    windows: [{ count: 2, size: "3600×1170 мм" }],
  },
  {
    id: "3",
    tag: "Склад",
    name: "Склад запчастей",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/64232a50-29a2-4074-9bf3-50ff6af24508.jpeg",
    width: 24,
    length: 32,
    height: 6.5,
    price: 11_924_306,
    crane: "Нет",
    region: "Москва",
    stripGlazing: "60 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "4",
    tag: "Склад",
    name: "Склад кухонных изделий",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/d36954e1-ad33-4afb-922d-2c819bd74d93.jpeg",
    width: 16,
    length: 32,
    height: 5,
    price: 8_055_965,
    crane: "Нет",
    region: "Москва",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: false },
    windows: [],
  },
  {
    id: "5",
    tag: "Производственно-складское",
    name: "Производственно-складское здание",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/209c297a-0b7d-474b-9f17-6ca586225745.jpg",
    width: 24,
    length: 60,
    height: 6,
    price: 19_413_124,
    crane: "Нет",
    region: "Москва",
    doors: [{ count: 2, size: "900×2100 мм" }],
    gates: { count: 2, size: "3000×3000 мм", wicket: false },
    windows: [{ count: 28, size: "3600×1170 мм" }],
    popular: true,
  },
  {
    id: "6",
    tag: "Склад",
    name: "Склад запчастей",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/025a17c6-78d4-42b0-9894-42306c3d2365.jpg",
    width: 24,
    length: 60,
    height: 7.5,
    price: 23_630_330,
    crane: "3,2 т",
    region: "Москва",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: true },
    windows: [
      { count: 8, size: "3600×1170 мм" },
      { count: 1, size: "нестандарт 60 кв. м" },
    ],
  },
  {
    id: "7",
    tag: "Склад",
    name: "Склад строительных материалов",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/30129fd9-b514-4aac-a522-fb7a7285b25b.jpg",
    width: 12,
    length: 36,
    height: 5,
    price: 7_544_200,
    crane: "Нет",
    region: "Санкт-Петербург",
    stripGlazing: "68 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "8",
    tag: "Производство",
    name: "Цех металлообработки",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/7a64fdb4-0ecb-4615-9445-9995e738e8f0.jpeg",
    width: 18,
    length: 24,
    height: 6,
    price: 7_058_400,
    crane: "Нет",
    region: "Екатеринбург",
    doors: [{ count: 1, size: "1400×2100 мм" }],
    gates: { count: 1, size: "4000×4000 мм", wicket: false },
    windows: [{ count: 2, size: "3600×1170 мм" }],
  },
  {
    id: "9",
    tag: "Склад",
    name: "Склад автокомпонентов",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/1ab3b76f-955e-40c9-a4e6-970db07c7bfd.jpeg",
    width: 24,
    length: 32,
    height: 6.5,
    price: 12_180_000,
    crane: "Нет",
    region: "Нижний Новгород",
    stripGlazing: "60 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "10",
    tag: "Склад",
    name: "Склад мебельного производства",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/482c77f8-e87b-46c3-9d21-a5ec9617fcf2.jpeg",
    width: 16,
    length: 32,
    height: 5,
    price: 8_290_000,
    crane: "Нет",
    region: "Казань",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: false },
    windows: [],
  },
  {
    id: "11",
    tag: "Производственно-складское",
    name: "Производственно-складской комплекс",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/209c297a-0b7d-474b-9f17-6ca586225745.jpg",
    width: 24,
    length: 60,
    height: 6,
    price: 19_870_000,
    crane: "Нет",
    region: "Самара",
    doors: [{ count: 2, size: "900×2100 мм" }],
    gates: { count: 2, size: "3000×3000 мм", wicket: false },
    windows: [{ count: 28, size: "3600×1170 мм" }],
    popular: true,
  },
  {
    id: "12",
    tag: "Склад",
    name: "Склад продуктов питания",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/025a17c6-78d4-42b0-9894-42306c3d2365.jpg",
    width: 24,
    length: 60,
    height: 7.5,
    price: 24_100_000,
    crane: "3,2 т",
    region: "Ростов-на-Дону",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: true },
    windows: [
      { count: 8, size: "3600×1170 мм" },
      { count: 1, size: "нестандарт 60 кв. м" },
    ],
  },
  {
    id: "13",
    tag: "Склад",
    name: "Склад электрооборудования",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/93e86475-b421-46fc-bfc7-b8bf931f70a0.jpg",
    width: 12,
    length: 36,
    height: 5,
    price: 7_490_000,
    crane: "Нет",
    region: "Москва",
    stripGlazing: "68 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "14",
    tag: "Производство",
    name: "Цех деревообработки",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/12eab8cd-8653-452c-91b9-5ee7c10089f7.jpeg",
    width: 18,
    length: 24,
    height: 6,
    price: 6_990_000,
    crane: "Нет",
    region: "Санкт-Петербург",
    doors: [{ count: 1, size: "1400×2100 мм" }],
    gates: { count: 1, size: "4000×4000 мм", wicket: false },
    windows: [{ count: 2, size: "3600×1170 мм" }],
  },
  {
    id: "15",
    tag: "Производственно-складское",
    name: "База стройматериалов с производством",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/209c297a-0b7d-474b-9f17-6ca586225745.jpg",
    width: 24,
    length: 60,
    height: 6,
    price: 20_140_000,
    crane: "Нет",
    region: "Екатеринбург",
    doors: [{ count: 2, size: "900×2100 мм" }],
    gates: { count: 2, size: "3000×3000 мм", wicket: false },
    windows: [{ count: 28, size: "3600×1170 мм" }],
  },
  {
    id: "16",
    tag: "Склад",
    name: "Склад полимерной продукции",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/47933245-245a-4c21-8cc6-391d8846bc5f.jpeg",
    width: 24,
    length: 32,
    height: 6.5,
    price: 12_430_000,
    crane: "Нет",
    region: "Казань",
    stripGlazing: "60 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "17",
    tag: "Склад",
    name: "Склад текстильной продукции",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/30129fd9-b514-4aac-a522-fb7a7285b25b.jpg",
    width: 12,
    length: 36,
    height: 5,
    price: 7_410_000,
    crane: "Нет",
    region: "Самара",
    stripGlazing: "68 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "18",
    tag: "Производство",
    name: "Цех пластиковых изделий",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/166570fe-71b5-486f-8bd4-3fb61a420255.jpeg",
    width: 18,
    length: 24,
    height: 6,
    price: 6_910_000,
    crane: "Нет",
    region: "Ростов-на-Дону",
    doors: [{ count: 1, size: "1400×2100 мм" }],
    gates: { count: 1, size: "4000×4000 мм", wicket: false },
    windows: [{ count: 2, size: "3600×1170 мм" }],
  },
  {
    id: "19",
    tag: "Склад",
    name: "Склад бытовой техники",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/17e85484-dd4c-4856-a76a-df36c1ab9a50.jpeg",
    width: 24,
    length: 32,
    height: 6.5,
    price: 12_050_000,
    crane: "Нет",
    region: "Москва",
    stripGlazing: "60 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "20",
    tag: "Склад",
    name: "Склад упаковочных материалов",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/767bcb6b-8016-43d0-a19f-465e82a2d174.jpeg",
    width: 16,
    length: 32,
    height: 5,
    price: 8_120_000,
    crane: "Нет",
    region: "Санкт-Петербург",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: false },
    windows: [],
  },
  {
    id: "21",
    tag: "Производственно-складское",
    name: "Производственная база с цехом",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/209c297a-0b7d-474b-9f17-6ca586225745.jpg",
    width: 24,
    length: 60,
    height: 6,
    price: 19_990_000,
    crane: "Нет",
    region: "Екатеринбург",
    doors: [{ count: 2, size: "900×2100 мм" }],
    gates: { count: 2, size: "3000×3000 мм", wicket: false },
    windows: [{ count: 28, size: "3600×1170 мм" }],
  },
  {
    id: "22",
    tag: "Склад",
    name: "Склад химической продукции",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/025a17c6-78d4-42b0-9894-42306c3d2365.jpg",
    width: 24,
    length: 60,
    height: 7.5,
    price: 24_350_000,
    crane: "3,2 т",
    region: "Нижний Новгород",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: true },
    windows: [
      { count: 8, size: "3600×1170 мм" },
      { count: 1, size: "нестандарт 60 кв. м" },
    ],
  },
  {
    id: "23",
    tag: "Склад",
    name: "Склад сантехники",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/b32f34de-edf4-4d1e-8a09-5bc52de33a91.jpg",
    width: 12,
    length: 36,
    height: 5,
    price: 7_350_000,
    crane: "Нет",
    region: "Казань",
    stripGlazing: "68 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "24",
    tag: "Производство",
    name: "Цех пищевого производства",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/c3127ee9-3f0c-4282-aedc-3ec91b68ec60.jpeg",
    width: 18,
    length: 24,
    height: 6,
    price: 7_020_000,
    crane: "Нет",
    region: "Самара",
    doors: [{ count: 1, size: "1400×2100 мм" }],
    gates: { count: 1, size: "4000×4000 мм", wicket: false },
    windows: [{ count: 2, size: "3600×1170 мм" }],
  },
  {
    id: "25",
    tag: "Склад",
    name: "Склад инструментов",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/f9b692ac-341a-409c-a5a3-53174ee9b88b.jpeg",
    width: 24,
    length: 32,
    height: 6.5,
    price: 12_290_000,
    crane: "Нет",
    region: "Ростов-на-Дону",
    stripGlazing: "60 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "26",
    tag: "Склад",
    name: "Склад спортивных товаров",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/23727fe0-309e-4228-9382-b26e8b1576b4.jpeg",
    width: 16,
    length: 32,
    height: 5,
    price: 8_200_000,
    crane: "Нет",
    region: "Москва",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: false },
    windows: [],
  },
  {
    id: "27",
    tag: "Производственно-складское",
    name: "Логистический терминал",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/209c297a-0b7d-474b-9f17-6ca586225745.jpg",
    width: 24,
    length: 60,
    height: 6,
    price: 20_310_000,
    crane: "Нет",
    region: "Санкт-Петербург",
    doors: [{ count: 2, size: "900×2100 мм" }],
    gates: { count: 2, size: "3000×3000 мм", wicket: false },
    windows: [{ count: 28, size: "3600×1170 мм" }],
  },
  {
    id: "28",
    tag: "Склад",
    name: "Склад медицинских изделий",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/025a17c6-78d4-42b0-9894-42306c3d2365.jpg",
    width: 24,
    length: 60,
    height: 7.5,
    price: 23_980_000,
    crane: "3,2 т",
    region: "Екатеринбург",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: true },
    windows: [
      { count: 8, size: "3600×1170 мм" },
      { count: 1, size: "нестандарт 60 кв. м" },
    ],
  },
  {
    id: "29",
    tag: "Склад",
    name: "Склад канцелярских товаров",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/cb769bb0-8ecc-47b9-a7d9-e40a6f7e9c97.jpg",
    width: 12,
    length: 36,
    height: 5,
    price: 7_470_000,
    crane: "Нет",
    region: "Нижний Новгород",
    stripGlazing: "68 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "30",
    tag: "Производство",
    name: "Цех упаковки",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/7ccc2058-0835-490c-a393-eb0bf6d86339.jpg",
    width: 18,
    length: 24,
    height: 6,
    price: 6_870_000,
    crane: "Нет",
    region: "Казань",
    doors: [{ count: 1, size: "1400×2100 мм" }],
    gates: { count: 1, size: "4000×4000 мм", wicket: false },
    windows: [{ count: 2, size: "3600×1170 мм" }],
  },
  {
    id: "31",
    tag: "Склад",
    name: "Склад керамической плитки",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/1afc4d38-e45b-4640-b4c8-7fc9abdef17d.jpg",
    width: 24,
    length: 32,
    height: 6.5,
    price: 12_510_000,
    crane: "Нет",
    region: "Самара",
    stripGlazing: "60 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "32",
    tag: "Склад",
    name: "Склад садовой техники",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/ccc2c668-94a3-4309-ba5c-7606d09f1e63.jpeg",
    width: 16,
    length: 32,
    height: 5,
    price: 8_050_000,
    crane: "Нет",
    region: "Ростов-на-Дону",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: false },
    windows: [],
  },
  {
    id: "33",
    tag: "Производственно-складское",
    name: "Распределительный центр",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/209c297a-0b7d-474b-9f17-6ca586225745.jpg",
    width: 24,
    length: 60,
    height: 6,
    price: 20_060_000,
    crane: "Нет",
    region: "Москва",
    doors: [{ count: 2, size: "900×2100 мм" }],
    gates: { count: 2, size: "3000×3000 мм", wicket: false },
    windows: [{ count: 28, size: "3600×1170 мм" }],
  },
  {
    id: "34",
    tag: "Склад",
    name: "Склад светотехники",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/025a17c6-78d4-42b0-9894-42306c3d2365.jpg",
    width: 24,
    length: 60,
    height: 7.5,
    price: 24_200_000,
    crane: "3,2 т",
    region: "Санкт-Петербург",
    doors: [],
    gates: { count: 2, size: "4000×4000 мм", wicket: true },
    windows: [
      { count: 8, size: "3600×1170 мм" },
      { count: 1, size: "нестандарт 60 кв. м" },
    ],
  },
  {
    id: "35",
    tag: "Склад",
    name: "Склад автомасел",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/5f3b9a3b-6252-4f07-b65b-837659325c80.jpg",
    width: 12,
    length: 36,
    height: 5,
    price: 7_390_000,
    crane: "Нет",
    region: "Екатеринбург",
    stripGlazing: "68 пог. м",
    doors: [{ count: 1, size: "1000×2100 мм" }],
    gates: { count: 1, size: "3000×3000 мм", wicket: false },
    windows: [],
  },
  {
    id: "36",
    tag: "Производство",
    name: "Цех сборки оборудования",
    image:
      "https://cdn.poehali.dev/projects/ab2b7839-0d92-4b8e-819f-853ca03a6009/bucket/7ccc2058-0835-490c-a393-eb0bf6d86339.jpg",
    width: 18,
    length: 24,
    height: 6,
    price: 6_950_000,
    crane: "Нет",
    region: "Нижний Новгород",
    doors: [{ count: 1, size: "1400×2100 мм" }],
    gates: { count: 1, size: "4000×4000 мм", wicket: false },
    windows: [{ count: 2, size: "3600×1170 мм" }],
  },
];

const TAGS: BuildingTag[] = [
  "Склад",
  "Производство",
  "Производственно-складское",
];

const TAG_TO_FRAME: Record<BuildingTag, string> = {
  Склад: "Р1",
  Производство: "Р2",
  "Производственно-складское": "Р4",
};

const CATALOG_WITH_SKU = (() => {
  let iterator = 1;
  return CATALOG.map((item) => ({
    ...item,
    sku: `${TAG_TO_FRAME[item.tag]}-${item.width * item.length}-${iterator++}`,
  }));
})();

const REGIONS = [...new Set(CATALOG.map((c) => c.region))].sort();

const AREA_RANGES: { label: AreaRange; test: (a: number) => boolean }[] = [
  { label: "до 1000 м²", test: (a) => a < 1000 },
  { label: "1000–1500 м²", test: (a) => a >= 1000 && a <= 1500 },
  { label: "свыше 1500 м²", test: (a) => a > 1500 },
];

const HEIGHT_RANGES: { label: HeightRange; test: (h: number) => boolean }[] = [
  { label: "до 5 м", test: (h) => h < 5 },
  { label: "5–8 м", test: (h) => h >= 5 && h <= 8 },
  { label: "свыше 8 м", test: (h) => h > 8 },
];

const FORMAT_RUB = (n: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n);

const LEASING_ADVANCE = 0.2;
const LEASING_MONTHS = 36;
const LEASING_RATE = 0.165;

function calcLeasing(price: number) {
  const advance = price * LEASING_ADVANCE;
  const body = price - advance;
  const monthlyRate = LEASING_RATE / 12;
  const payment =
    (body * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -LEASING_MONTHS));
  return { advance, payment };
}

// ─── Маппинг тега → тип калькулятора ────────────────────────────────────────

const TAG_TO_CALC_TYPE: Record<BuildingTag, string> = {
  Склад: "warehouse",
  Производство: "production",
  "Производственно-складское": "production",
};

// ─── Компонент ──────────────────────────────────────────────────────────────

export default function Catalog() {
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState<BuildingTag | "Все">("Все");
  const [calcInitial, setCalcInitial] = useState<
    PriceCalculatorInitial | undefined
  >(undefined);
  const [activeRegion, setActiveRegion] = useState<string>("Все");
  const [customRegion, setCustomRegion] = useState<string>("");
  const [activeArea, setActiveArea] = useState<AreaRange | "Все">("Все");
  const [activeHeight, setActiveHeight] = useState<HeightRange | "Все">("Все");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 6;

  const shuffledCatalog = useMemo(() => {
    const arr = [...CATALOG_WITH_SKU];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const filtered = shuffledCatalog
    .filter((item) => activeTag === "Все" || item.tag === activeTag)
    .filter(
      (item) =>
        activeRegion === "Все" ||
        item.region.toLowerCase().includes(activeRegion.toLowerCase()),
    )
    .filter((item) => {
      if (activeArea === "Все") return true;
      const range = AREA_RANGES.find((r) => r.label === activeArea);
      return range ? range.test(item.width * item.length) : true;
    })
    .filter((item) => {
      if (activeHeight === "Все") return true;
      const range = HEIGHT_RANGES.find((r) => r.label === activeHeight);
      return range ? range.test(item.height) : true;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedFiltered = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTag, activeRegion, activeArea, activeHeight]);

  const faqs = [
    {
      q: "У конкурентов дешевле — почему EVRAZ дороже?",
      a: "Цена конкурента — это часто цена металлокаркаса без ограждающих конструкций, фундамента и монтажа. Мы указываем полную стоимость здания под ключ. Сравните позиции в смете — и картина изменится. Плюс: сталь EVRAZ производится нами самими, а не закупается на рынке с наценкой.",
    },
    {
      q: "Как выбрать подрядчика по монтажу?",
      a: "Работайте только с аккредитованными партнёрами EVRAZ — они прошли обучение, имеют допуски и застрахованы. Список партнёров по вашему региону мы предоставим бесплатно. Неаккредитованный подрядчик лишает вас гарантии на конструкции.",
    },
    {
      q: "Что требуется от заказчика на этапе строительства?",
      a: "От вас нужно: согласованный проект с привязкой к участку, готовый фундамент (по нашему ТЗ), подведённое электричество 380В для монтажного оборудования, и назначенный ответственный со стороны заказчика. Мы выдаём чёткое ТЗ на подготовку — ничего лишнего.",
    },
    {
      q: "Входит ли фундамент в цену?",
      a: "Нет. Фундамент рассчитывается отдельно после геологии участка. Ориентировочно — 15–25% от стоимости здания. Мы можем порекомендовать проверенного геологического подрядчика.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-ibm">
      {/* HEADER */}
      <Header
        backButton={{ label: "На главную", onClick: () => navigate("/") }}
      />

      {/* HERO */}
      <section className="bg-evraz-charcoal relative overflow-hidden py-16 md:py-20">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(107,63,160,0.3) 40px, rgba(107,63,160,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(107,63,160,0.3) 40px, rgba(107,63,160,0.3) 41px)",
          }}
        />
        <div className="container mx-auto relative z-10">
          <h1 className="font-oswald text-4xl md:text-6xl text-evraz-dark font-bold mb-4 leading-tight">
            КАТАЛОГ ГОТОВЫХ
            <br />
            <span className="text-evraz-red">РЕШЕНИЙ</span>
          </h1>
          <p className="font-ibm text-evraz-gray max-w-2xl text-base leading-relaxed mb-8">
            Широкий ассортимент типовых решений с предварительно рассчитанной
            стоимостью.
          </p>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { v: "30 дней", l: "Производство и поставка" },
              { v: "20 дней", l: "Монтаж" },
              {
                v: "Предварительный КМ+ОК за час",
                l: "С помощью автоматического проектирования",
              },
              { v: "Точная цена", l: "Без скрытых доплат" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-oswald text-2xl text-evraz-dark font-bold">
                  {s.v}
                </div>
                <div className="font-ibm text-xs text-evraz-gray uppercase tracking-wider mt-0.5">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSTRUCTION CYCLE PROMO */}
      <section className="bg-white border-b border-evraz-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-7">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-evraz-dark flex items-center justify-center shrink-0">
                <span className="text-evraz-red font-oswald text-xl font-bold">?</span>
              </div>
              <div>
                <div className="font-oswald text-lg md:text-xl text-evraz-dark font-semibold leading-tight">
                  Не знаете, что ждать от строительства?
                </div>
                <div className="font-ibm text-sm text-evraz-gray mt-0.5">
                  Объясняем цикл стройки и что потребуется от вас на каждом этапе
                </div>
              </div>
            </div>
            <button
              onClick={() => document.getElementById("construction-cycle")?.scrollIntoView({ behavior: "smooth" })}
              className="shrink-0 font-oswald text-sm tracking-wider uppercase px-7 py-3 border-2 border-evraz-dark text-evraz-dark hover:bg-evraz-dark hover:text-white transition-all whitespace-nowrap"
            >
              Читать про цикл стройки →
            </button>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="bg-evraz-light border-b border-evraz-border py-5">
        <div className="container mx-auto space-y-4">
          {/* Строка 1: Назначение здания */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ibm text-xs text-evraz-gray w-36 shrink-0">
              Назначение:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(["Все", ...TAGS] as (BuildingTag | "Все")[]).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`font-oswald text-xs tracking-widest uppercase px-3 py-1.5 border transition-all ${
                    activeTag === tag
                      ? "bg-evraz-red border-evraz-red text-white"
                      : "border-evraz-border text-evraz-steel hover:border-evraz-red hover:text-evraz-red bg-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Строка 2: Регион */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-ibm text-xs text-evraz-gray w-36 shrink-0">
              Регион:
            </span>
            <div className="flex flex-wrap gap-1.5 items-center">
              {["Все", ...REGIONS].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRegion(r);
                    setCustomRegion("");
                  }}
                  className={`font-ibm text-xs px-3 py-1.5 border transition-all ${
                    activeRegion === r && !customRegion
                      ? "bg-evraz-dark border-evraz-dark text-white"
                      : "border-evraz-border text-evraz-steel hover:border-evraz-dark bg-white"
                  }`}
                >
                  {r}
                </button>
              ))}
              <input
                type="text"
                placeholder="Другой город..."
                value={customRegion}
                onChange={(e) => {
                  setCustomRegion(e.target.value);
                  setActiveRegion(e.target.value.trim() || "Все");
                }}
                className={`font-ibm text-xs px-3 py-1.5 border transition-all outline-none w-36 ${
                  customRegion
                    ? "bg-evraz-dark border-evraz-dark text-white placeholder-white/50"
                    : "border-evraz-border text-evraz-steel bg-white placeholder-evraz-gray/60"
                }`}
              />
            </div>
          </div>

          {/* Строка 3: Площадь + Высота */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-ibm text-xs text-evraz-gray w-36 shrink-0">
                Площадь здания:
              </span>
              <div className="flex gap-1.5">
                {(
                  ["Все", ...AREA_RANGES.map((r) => r.label)] as (
                    | AreaRange
                    | "Все"
                  )[]
                ).map((a) => (
                  <button
                    key={a}
                    onClick={() => setActiveArea(a)}
                    className={`font-ibm text-xs px-3 py-1.5 border transition-all whitespace-nowrap ${
                      activeArea === a
                        ? "bg-evraz-dark border-evraz-dark text-white"
                        : "border-evraz-border text-evraz-steel hover:border-evraz-dark bg-white"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-ibm text-xs text-evraz-gray w-36 shrink-0">
                Высота здания:
              </span>
              <div className="flex gap-1.5">
                {(
                  ["Все", ...HEIGHT_RANGES.map((r) => r.label)] as (
                    | HeightRange
                    | "Все"
                  )[]
                ).map((h) => (
                  <button
                    key={h}
                    onClick={() => setActiveHeight(h)}
                    className={`font-ibm text-xs px-3 py-1.5 border transition-all whitespace-nowrap ${
                      activeHeight === h
                        ? "bg-evraz-dark border-evraz-dark text-white"
                        : "border-evraz-border text-evraz-steel hover:border-evraz-dark bg-white"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <span className="font-ibm text-xs text-evraz-gray ml-auto">
              {filtered.length} проектов
            </span>
          </div>
        </div>
      </section>

      {/* CATALOG GRID */}
      <section className="py-12 bg-white">
        <div className="container mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Icon
                name="SearchX"
                size={40}
                className="text-evraz-gray mx-auto mb-4"
              />
              <p className="font-oswald text-xl text-evraz-steel">
                Нет проектов по заданным параметрам
              </p>
              <button
                onClick={() => {
                  setActiveTag("Все");
                  setActiveRegion("Все");
                  setActiveArea("Все");
                  setActiveHeight("Все");
                }}
                className="mt-4 font-ibm text-sm text-evraz-red underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pagedFiltered.map((item) => (
                  <div
                    key={item.id}
                    className="steel-card bg-white border border-evraz-border flex flex-col group"
                  >
                    {/* Header */}
                    <div className="bg-evraz-dark px-6 py-5 flex items-start justify-between min-h-[120px]">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-oswald text-xs tracking-widest text-evraz-red uppercase bg-white/5 px-2 py-0.5">
                            #{item.sku}
                          </span>
                          {item.popular && (
                            <span className="font-oswald text-xs text-white tracking-widest uppercase bg-evraz-red px-2 py-0.5">
                              Популярный
                            </span>
                          )}
                        </div>
                        <h3 className="font-oswald text-xl text-white font-semibold mt-2 leading-tight line-clamp-2">
                          {item.name}
                        </h3>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="font-oswald text-2xl text-evraz-red font-bold">
                          {FORMAT_RUB(item.price)}
                        </div>
                        <div className="font-ibm text-xs text-gray-400 mt-0.5">
                          {Math.round(
                            item.price / (item.width * item.length),
                          ).toLocaleString("ru-RU")}{" "}
                          ₽/м²
                        </div>
                        <div className="font-ibm text-xs text-gray-400 mt-1">
                          цена актуальна на 03.06.2026
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="overflow-hidden h-52 bg-evraz-light">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-4 divide-x divide-evraz-border border-b border-evraz-border">
                      {[
                        { label: "Ширина", value: `${item.width} м` },
                        { label: "Длина", value: `${item.length} м` },
                        { label: "Высота", value: `${item.height} м` },
                        {
                          label: "Площадь",
                          value: `${(item.width * item.length).toLocaleString("ru-RU")} м²`,
                        },
                      ].map((d) => (
                        <div key={d.label} className="py-3 px-3 text-center">
                          <div className="font-oswald text-sm text-evraz-dark font-semibold">
                            {d.value}
                          </div>
                          <div className="font-ibm text-xs text-evraz-gray mt-0.5">
                            {d.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Specs */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Комплектация + технические параметры */}
                      <div className="mb-5 divide-y divide-evraz-border border border-evraz-border">
                        {[
                          {
                            icon: "RectangleHorizontal",
                            label: "Ворота",
                            value: item.gates
                              ? `${item.gates.count} шт. (${item.gates.size}${item.gates.wicket ? ", с калиткой" : ", без калитки"})`
                              : "Нет",
                          },
                          {
                            icon: "DoorOpen",
                            label: "Двери",
                            value:
                              item.doors.length > 0
                                ? item.doors
                                    .map((d) => `${d.count} шт. (${d.size})`)
                                    .join(", ")
                                : "Нет",
                          },
                          {
                            icon: "AppWindow",
                            label: "Окна",
                            value:
                              item.windows.length > 0
                                ? item.windows
                                    .map((w) => `${w.count} шт. (${w.size})`)
                                    .join(", ")
                                : "Нет",
                          },
                          {
                            icon: "Columns2",
                            label: "Лент. остекление",
                            value: item.stripGlazing ?? "Нет",
                            highlight: !!item.stripGlazing,
                          },
                          {
                            icon: "Hammer",
                            label: "Кран-балка",
                            value: item.crane,
                            highlight: item.crane !== "Нет",
                          },
                          {
                            icon: "MapPin",
                            label: "Регион",
                            value: item.region,
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center gap-3 px-3 py-2"
                          >
                            <Icon
                              name={row.icon as "Tag"}
                              size={12}
                              className="text-evraz-steel shrink-0"
                            />
                            <span className="font-ibm text-xs text-evraz-gray w-28 shrink-0">
                              {row.label}
                            </span>
                            <span
                              className={`font-ibm text-xs font-medium ml-auto text-right ${row.highlight ? "text-evraz-red" : "text-evraz-dark"}`}
                            >
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Лизинг */}
                      {(() => {
                        const { advance, payment } = calcLeasing(item.price);
                        return (
                          <div className="border border-evraz-red/20 bg-evraz-red/5 px-4 py-3 mb-5">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Icon
                                name="CreditCard"
                                size={13}
                                className="text-evraz-red shrink-0"
                              />
                              <span className="font-oswald text-xs tracking-widest uppercase text-evraz-red">
                                Лизинг от банка-партнера
                              </span>
                            </div>
                            <div className="font-oswald text-lg text-evraz-dark font-bold leading-none">
                              {FORMAT_RUB(Math.round(payment))}/мес.
                            </div>
                            <div className="font-ibm text-xs text-evraz-gray mt-1">
                              Аванс {FORMAT_RUB(Math.round(advance))} · 36 мес.
                            </div>
                          </div>
                        );
                      })()}

                      {/* CTA */}
                      <div className="flex gap-3 mt-auto">
                        <button
                          onClick={() => {
                            setCalcInitial({
                              width: item.width,
                              length: item.length,
                              height: Math.min(12, item.height),
                              buildingType: TAG_TO_CALC_TYPE[item.tag],
                              gates: item.gates?.count ?? 0,
                              windows: item.windows.reduce(
                                (acc, w) => acc + w.count,
                                0,
                              ),
                              region: item.region,
                            });
                            setTimeout(() => {
                              document
                                .getElementById("calc-section")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }, 50);
                          }}
                          className="flex-1 text-center font-oswald text-sm tracking-wider uppercase py-3 border-2 border-evraz-dark text-evraz-dark hover:bg-evraz-dark hover:text-white transition-all"
                        >
                          Изменить размер
                        </button>
                        <button
                          onClick={() =>
                            document
                              .getElementById("contacts-section")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                          className="flex-1 btn-primary text-sm text-center"
                        >
                          Получить расчет
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="font-ibm text-xs px-4 py-2 border border-evraz-border text-evraz-steel hover:border-evraz-dark bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`font-ibm text-xs px-4 py-2 border transition-all ${
                          currentPage === page
                            ? "bg-evraz-dark border-evraz-dark text-white"
                            : "border-evraz-border text-evraz-steel hover:border-evraz-dark bg-white"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="font-ibm text-xs px-4 py-2 border border-evraz-border text-evraz-steel hover:border-evraz-dark bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* MINI CALCULATOR */}
      <section
        id="calc-section"
        className="py-16 bg-evraz-dark relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-evraz-red" />
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-0.5 bg-evraz-red" />
            </div>
            <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold">
              НЕТ НУЖНОГО РАЗМЕРА?
            </h2>
            <p className="font-ibm text-gray-400 mt-3 text-sm leading-relaxed">
              Введите свои параметры — получите мгновенную оценку стоимости.
            </p>
          </div>
          {calcInitial && (
            <div className="max-w-3xl mx-auto mb-4">
              <div className="flex items-center gap-3 bg-evraz-red/10 border border-evraz-red/30 px-4 py-3">
                <Icon
                  name="Info"
                  size={14}
                  className="text-evraz-red shrink-0"
                />
                <span className="font-ibm text-xs text-evraz-red">
                  Параметры загружены из карточки: {calcInitial.width}×
                  {calcInitial.length} м, высота {calcInitial.height} м
                </span>
                <button
                  onClick={() => setCalcInitial(undefined)}
                  className="ml-auto text-evraz-red hover:opacity-70"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            </div>
          )}
          <PriceCalculator
            key={JSON.stringify(calcInitial)}
            initialValues={calcInitial}
            regions={REGIONS}
            onGetQuote={() =>
              document
                .getElementById("contacts-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </div>
      </section>

      {/* СОСТАВ ЦЕНЫ */}
      <section className="py-16 bg-white border-t border-evraz-border">
        <div className="container mx-auto">
          <div className="mb-10">
            <div className="font-oswald text-xs tracking-widest text-evraz-red uppercase mb-3">
              Прозрачное ценообразование
            </div>
            <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-bold">
              Что включено в расчёт
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Входит */}
            <div className="border border-evraz-border">
              <div className="bg-evraz-dark px-8 py-5 flex items-center gap-3">
                <div className="w-5 h-5 bg-evraz-red flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="font-oswald text-base tracking-widest text-white uppercase">
                  Входит в стоимость
                </span>
              </div>
              <ul className="divide-y divide-evraz-border">
                {[
                  "Металлический каркас здания",
                  "Стеновые и кровельные сэндвич-панели",
                  "Торцевые и боковые ограждающие конструкции",
                  "Ворота и двери согласно комплектации",
                  "Оконные блоки согласно комплектации",
                  "Доборные элементы и крепёж",
                  "Проектная документация КМД",
                  "Доставка на объект",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-4 px-8 py-4">
                    <div className="w-1.5 h-1.5 bg-evraz-red rounded-full shrink-0" />
                    <span className="font-ibm text-sm text-evraz-dark">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Не входит */}
            <div className="border border-evraz-border">
              <div className="bg-evraz-light px-8 py-5 flex items-center gap-3 border-b border-evraz-border">
                <div className="w-5 h-5 border-2 border-evraz-gray flex items-center justify-center shrink-0">
                  <span className="text-evraz-gray text-xs font-bold leading-none">
                    —
                  </span>
                </div>
                <span className="font-oswald text-base tracking-widest text-evraz-dark uppercase">
                  Не входит в стоимость
                </span>
              </div>
              <ul className="divide-y divide-evraz-border">
                {[
                  "Фундамент и земляные работы",
                  "Электроснабжение и электромонтаж",
                  "Отопление и вентиляция",
                  "Водоснабжение и канализация",
                  "Пожарная сигнализация и автоматика",
                  "Внутренняя отделка и перегородки",
                  "Монтаж здания (доступен отдельно)",
                  "Геодезия и согласования",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-4 px-8 py-4">
                    <div className="w-1.5 h-1.5 bg-evraz-gray/40 rounded-full shrink-0" />
                    <span className="font-ibm text-sm text-evraz-gray">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* КP+АР SPECIAL OFFER */}
      <section className="py-12 bg-evraz-light border-t border-evraz-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white border border-evraz-border p-8 md:p-10 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-evraz-red" />
            <div className="flex-1 pl-4">
              <div className="font-oswald text-xs tracking-widest text-evraz-red uppercase mb-2">
                Специальное предложение
              </div>
              <h2 className="font-oswald text-2xl md:text-3xl text-evraz-dark font-bold leading-tight">
                Комплект документации КР + АР
              </h2>
              <p className="font-ibm text-sm text-evraz-steel mt-3 leading-relaxed max-w-lg">
                Конструктивные решения (КР) и архитектурные решения (АР) — пакет
                документов для согласования и строительства. Готовим за 7
                рабочих дней.
              </p>
              <a
                href="/arkr"
                className="inline-flex items-center gap-1.5 mt-4 font-ibm text-sm text-evraz-red hover:underline"
              >
                Читать подробнее
                <Icon name="ArrowRight" size={14} />
              </a>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
              <div className="text-center md:text-right">
                <div className="font-oswald text-4xl font-bold text-evraz-red">
                  9 998 ₽
                </div>
                <div className="font-ibm text-xs text-evraz-gray mt-1">
                  вместо 25 000 ₽ · ограниченное предложение
                </div>
              </div>
              <button
                onClick={() =>
                  document
                    .getElementById("contacts-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-primary font-oswald tracking-wider uppercase px-8 py-3 text-sm whitespace-nowrap"
              >
                Заказать КР + АР
              </button>
              <p className="font-ibm text-xs text-evraz-gray text-center">
                Менеджер свяжется в течение 1 часа
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S NEEDED FROM CLIENT */}
      <section id="construction-cycle" className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="accent-line mx-auto" />
            </div>
            <h2 className="font-oswald text-3xl md:text-4xl text-evraz-dark font-semibold">
              Цикл строительства здания
            </h2>
            <p className="font-ibm text-evraz-gray mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Мы берём на себя максимум. Ниже — таймлайн стройки и что требуется
              от вас на каждом этапе.
            </p>
          </div>

          {/* Таймлайн */}
          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "01",
                phase: "1–3 месяца",
                icon: "MapPin",
                title: "Участок и концепция",
                client: [
                  "Подбирает и оформляет земельный участок",
                  "Определяет назначение будущего здания",
                ],
                us: [
                  "Помогаем выбрать формат: капитальный или некапитальный объект",
                  "Даём предварительный диапазон бюджета для разных габаритов здания",
                ],
              },
              {
                step: "02",
                phase: "от 30 дней",
                icon: "Layers",
                title: "Подготовка участка и сбор ИРД",
                client: [
                  "Заказывает ГПЗУ и инженерные изыскания (геология, геодезия)",
                  "Получает технические условия на подключение к сетям",
                ],
                us: [
                  "Консультируем по ограничениям участка (по ГПЗУ)",
                  "Выдаём чек-лист ИРД и подключаем партнёров (геологов и геодезистов)",
                  "Рекомендуем партнёра-проектировщика, который рассчитает нагрузки (ТЭП) для получения ТУ",
                  "Рекомендуем партнера-технческого заказчика, которые собирает и подает ИРД",
                  "Предоставляем несколько предложений по стоимости строительства от аккредитованных партнёров",
                ],
              },
              {
                step: "03",
                phase: "от 2х месяцев",
                icon: "FileText",
                title: "Проектирование и экспертиза",
                client: [
                  "Формирует техническое задание",
                  "Согласовывает архитектурный облик (при необходимости)",
                ],
                us: [
                  "Выпускаем АР+КР за 7 рабочих дней (от 9 998 ₽)",
                  "Партнёр-проектировщик выпускает полный комплект проектной документации",
                  "Партнёр-проектировщик сопровождает прохождение экспертизы",
                ],
              },
              {
                step: "04",
                phase: "~30 рабочих дней",
                icon: "ClipboardCheck",
                title: "Разрешение на строительство",
                client: ["Подаёт заявление через Госуслуги или МФЦ"],
                us: [
                  "Партнёр-проектировщик собирает и проверяет полный пакет документов",
                  "(опционально) Подаёт по доверенности заявление через Госуслуги или МФЦ",
                  "Помогаем выбрать подходящего партнёра на строительство",
                ],
              },
              {
                step: "05",
                phase: "8–10 недель (склад 1 500 м²)",
                icon: "Zap",
                title: "Строительство и контроль",
                client: ["Принимает работы и контролирует ход стройки"],
                us: [
                  "Производим и поставляем комплект здания под монтаж партнеру-строителю в соответствии с графиком монтажа",
                  "Партнёр-строитель ведёт монтаж и предоставляет исполнительную документацию",
                ],
              },
              {
                step: "06",
                phase: "~30 дней",
                icon: "CheckSquare",
                title: "Ввод в эксплуатацию",
                client: [
                  "Подаёт заявление на ввод объекта",
                  "Регистрирует право собственности в ЕГРН",
                ],
                us: [
                  "Партнер-строитель сдаёт исполнительную документация заказчику",
                  "Партнёр-техничский заказчик готовит пакет документов для ввода",
                ],
              },
            ].map((s, i, arr) => (
              <div key={s.step} className="flex gap-6 relative">
                {/* Вертикальная линия */}
                {i < arr.length - 1 && (
                  <div className="absolute left-[27px] top-[56px] bottom-0 w-px bg-evraz-border" />
                )}
                {/* Иконка-маркер */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-14 h-14 bg-evraz-dark flex items-center justify-center relative z-10">
                    <Icon name={s.icon} size={20} className="text-white" />
                  </div>
                </div>
                {/* Контент */}
                <div
                  className={`pb-10 flex-1 ${i === arr.length - 1 ? "pb-0" : ""}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-ibm text-xs text-evraz-red font-medium tracking-widest uppercase">
                      ⏱ {s.phase}
                    </span>
                    <span className="font-oswald text-xs text-evraz-border tracking-widest">
                      ШАГ {s.step}
                    </span>
                  </div>
                  <h4 className="font-oswald text-lg text-evraz-dark font-semibold mb-3">
                    {s.title}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-red-50 border border-red-100 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon
                          name="User"
                          size={13}
                          className="text-evraz-red"
                        />
                        <span className="font-oswald text-xs text-evraz-red tracking-wider uppercase">
                          Что делает клиент
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {s.client.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 font-ibm text-xs text-evraz-dark leading-relaxed"
                          >
                            <span className="text-evraz-red mt-0.5 shrink-0">
                              •
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-evraz-light border border-evraz-border p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon
                          name="Building2"
                          size={13}
                          className="text-evraz-steel"
                        />
                        <span className="font-oswald text-xs text-evraz-steel tracking-wider uppercase">
                          Что делаем мы
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {s.us.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 font-ibm text-xs text-evraz-gray leading-relaxed"
                          >
                            <span className="text-evraz-steel mt-0.5 shrink-0">
                              •
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contacts-section" className="py-16 bg-evraz-dark">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-oswald text-3xl md:text-4xl text-white font-semibold mb-4">
            ОСТАЛИСЬ ВОПРОСЫ?
          </h2>
          <p className="font-ibm text-gray-400 mb-8 text-sm leading-relaxed">
            Оставьте заявку и наш менеджер свяжется с вами в течении 1 часа
          </p>
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Имя и фамилия*"
                className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors"
              />
              <input
                type="tel"
                placeholder="Телефон*"
                className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Укажите артикул проекта или опишите задачу..."
              className="w-full bg-white/5 border border-white/15 px-4 py-3 font-ibm text-white text-sm placeholder-gray-500 focus:outline-none focus:border-evraz-red transition-colors resize-none mb-4"
            />
            <button className="btn-primary w-full">Отправить заявку</button>
            <p className="font-ibm text-xs text-gray-600 mt-3">
              Нажимая кнопку, вы соглашаетесь с политикой обработки персональных
              данных
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}