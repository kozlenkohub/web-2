import React, { useState } from "react";
import "./Allergens.css";
import { useTranslation } from "react-i18next";

const Allergens = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const allergensData = {
    pl: {
      products: [
        {
          name: "Burger Classic",
          ingredients:
            "bułka maślana (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos do wyboru, sałata mix, pomidor, ogórek konserwowy (pikle), cebula czerwona, wołowina sezonowana 100% 200 g., lub panierowany filet z kurczaka",
          allergensList: [
            { item: "Bułka maślana", allergens: "gluten (pszenica), jaja" },
            {
              item: "Sałata mix",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Pomidor", allergens: "brak alergenów" },
            { item: "Ogórek konserwowy", allergens: "gorczyca, siarczyny" },
            { item: "Cebula czerwona", allergens: "brak alergenów" },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            {
              item: "Panierowany filet z kurczaka",
              allergens: "gluten (pszenica), jaja, mleko, soja",
              isAlternative: true,
            },
          ],
          totalAllergens: "gluten, jaja, mleko, soja, gorczyca, siarczyny",
        },
        {
          name: "Cheeseburger",
          ingredients:
            "bułka maślana (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos do wyboru, sałata mix, pomidor, ogórek konserwowy (pikle), cebula czerwona, cebula grillowana, ser cheddar, boczek, wołowina sezonowana 100% 200 g lub panierowany filet z kurczaka",
          allergensList: [
            { item: "Bułka maślana", allergens: "gluten (pszenica), jaja" },
            {
              item: "Sałata mix",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Pomidor", allergens: "brak alergenów" },
            { item: "Ogórek konserwowy", allergens: "gorczyca, siarczyny" },
            { item: "Cebula czerwona", allergens: "brak alergenów" },
            { item: "Cebula grillowana", allergens: "brak alergenów" },
            { item: "Ser cheddar", allergens: "mleko" },
            { item: "Boczek", allergens: "brak alergenów" },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            {
              item: "Panierowany filet z kurczaka",
              allergens: "gluten (pszenica), jaja, mleko, soja",
              isAlternative: true,
            },
          ],
          totalAllergens: "gluten, jaja, mleko, soja, gorczyca, siarczyny",
        },
        {
          name: "Burger BBQ",
          ingredients:
            "bułka maślana (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos tatarski, sałata mix, pomidor, wołowina sezonowana 100% 200 g karmelizowana sosem BBQ, boczek, cebula prażona",
          allergensList: [
            { item: "Bułka maślana", allergens: "gluten (pszenica), jaja" },
            {
              item: "Sos tatarski",
              allergens: "jaja, musztarda, mleko (możliwe), seler",
            },
            {
              item: "Sałata mix",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Pomidor", allergens: "brak alergenów" },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            {
              item: "Sos BBQ",
              allergens: "soja, musztarda, siarczyny (zależnie od producenta)",
            },
            { item: "Boczek", allergens: "brak alergenów" },
            { item: "Cebula prażona", allergens: "gluten (pszenica)" },
          ],
          totalAllergens:
            "gluten, jaja, mleko, soja, musztarda, seler, siarczyny",
        },
        {
          name: "Burger Anglik",
          ingredients:
            "bułka maślana (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos, sałata mix, pomidor, ogórek konserwowy (pikle), wołowina sezonowana 100% 200 g, cebula grillowana, ser cheddar, boczek, wędlina, jajko sadzone",
          allergensList: [
            { item: "Bułka maślana", allergens: "gluten (pszenica), jaja" },
            {
              item: "Sałata mix",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Pomidor", allergens: "brak alergenów" },
            { item: "Ogórek konserwowy", allergens: "gorczyca, siarczyny" },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            { item: "Cebula grillowana", allergens: "brak alergenów" },
            { item: "Ser cheddar", allergens: "mleko" },
            { item: "Boczek", allergens: "brak alergenów" },
            {
              item: "Wędlina",
              allergens: "brak alergenów (jeśli bez dodatków funkcjonalnych)",
            },
            { item: "Jajko sadzone", allergens: "jaja" },
          ],
          totalAllergens: "gluten, jaja, mleko, gorczyca",
        },
        {
          name: "Burger GastroFaza",
          ingredients:
            "bułka maślana (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos, cebula prażona, sałata mix, ogórek konserwowy (pikle), 2 × kotlet wołowy sezonowany 100% (2 × 200 g), boczek ×2, ser cheddar ×2, wędlina ×2, cebula grillowana",
          allergensList: [
            { item: "Bułka maślana", allergens: "gluten (pszenica), jaja" },
            { item: "Cebula prażona", allergens: "gluten (pszenica)" },
            {
              item: "Sałata mix",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Ogórek konserwowy", allergens: "gorczyca, siarczyny" },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            { item: "Boczek", allergens: "brak alergenów" },
            { item: "Ser cheddar", allergens: "mleko" },
            {
              item: "Wędlina",
              allergens: "brak alergenów (jeśli bez dodatków funkcjonalnych)",
            },
            { item: "Cebula grillowana", allergens: "brak alergenów" },
          ],
          totalAllergens: "gluten, jaja, mleko, gorczyca, siarczyny",
        },
        {
          name: "Burger Wege",
          ingredients:
            "bułka dla wege, sos wege, sałata mix, pomidor, ogórek świeży, cebula czerwona, cukinia grillowana, ser halloumi 200 g",
          allergensList: [
            {
              item: "Bułka dla wege",
              allergens: "gluten (pszenica) (jeśli bułka pszenna)",
            },
            {
              item: "Sałata mix",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Pomidor", allergens: "brak alergenów" },
            { item: "Ogórek świeży", allergens: "brak alergenów" },
            { item: "Cebula czerwona", allergens: "brak alergenów" },
            { item: "Cukinia grillowana", allergens: "brak alergenów" },
            { item: "Ser halloumi", allergens: "mleko" },
          ],
          totalAllergens: "gluten, mleko",
        },
        {
          name: 'Burger „Drwal"',
          ingredients:
            "bułka maślana (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos firmowy, cebula prażona, sałata mix, cebula czerwona, wołowina sezonowana 100% 200 g, boczek, ser panierowany, żurawina",
          allergensList: [
            { item: "Bułka maślana", allergens: "gluten (pszenica), jaja" },
            { item: "Cebula prażona", allergens: "gluten (pszenica)" },
            {
              item: "Sałata mix",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Cebula czerwona", allergens: "brak alergenów" },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            { item: "Boczek", allergens: "brak alergenów" },
            {
              item: "Ser panierowany",
              allergens: "gluten (pszenica), mleko, jaja",
            },
            {
              item: "Żurawina",
              allergens: "brak alergenów (jeśli bez konserwantów)",
            },
          ],
          totalAllergens: "gluten, jaja, mleko",
        },
        {
          name: "Smash Burger",
          ingredients:
            "bułka maślana (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos do wyboru, cebula grillowana, pikle lub jalapeño do wyboru, 2 × 100 g wołowina sezonowana 100%, ser cheddar, bekon",
          allergensList: [
            { item: "Bułka maślana", allergens: "gluten (pszenica), jaja" },
            { item: "Cebula grillowana", allergens: "brak alergenów" },
            {
              item: "Ogórek konserwowy (pikle)",
              allergens: "gorczyca, siarczyny",
            },
            {
              item: "Jalapeño",
              allergens: "brak alergenów (jeśli bez konserwantów)",
            },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            { item: "Ser cheddar", allergens: "mleko" },
            { item: "Bekon", allergens: "brak alergenów" },
          ],
          totalAllergens: "gluten, jaja, mleko, gorczyca, siarczyny",
        },
        {
          name: 'Burger „Góral"',
          ingredients:
            "bułka maślana (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos BBQ + żurawina (Fanex), rukola, cebula czerwona, wołowina sezonowana 100% 200 g, cebula grillowana, ser oscypek, boczek",
          allergensList: [
            { item: "Bułka maślana", allergens: "gluten (pszenica), jaja" },
            { item: "Rukola", allergens: "brak alergenów" },
            { item: "Cebula czerwona", allergens: "brak alergenów" },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            { item: "Cebula grillowana", allergens: "brak alergenów" },
            { item: "Ser oscypek", allergens: "mleko" },
            { item: "Boczek", allergens: "brak alergenów" },
            {
              item: "Sos BBQ + żurawina (Fanex)",
              allergens: "soja, gorczyca, seler, siarczyny",
            },
          ],
          totalAllergens:
            "gluten, jaja, mleko, soja, gorczyca, seler, siarczyny",
        },
        {
          name: "Burger Kurczak w bekonie",
          ingredients:
            "bułka maślana (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos BBQ (Fanex), mix sałata, ogórek konserwowy (pikle), cebula czerwona, kurczak zawinięty w boczek 200 g, ser cheddar, śliwka (żurawina)",
          allergensList: [
            { item: "Bułka maślana", allergens: "gluten (pszenica), jaja" },
            {
              item: "Mix sałata",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            {
              item: "Ogórek konserwowy (pikle)",
              allergens: "gorczyca, siarczyny",
            },
            { item: "Cebula czerwona", allergens: "brak alergenów" },
            {
              item: "Kurczak zawinięty w boczek",
              allergens: "brak alergenów (jeśli bez panierki i dodatków)",
            },
            { item: "Ser cheddar", allergens: "mleko" },
            {
              item: "Śliwka / żurawina",
              allergens: "siarczyny (jeśli użyte konserwanty)",
            },
            {
              item: "Sos BBQ (Fanex)",
              allergens: "soja, gorczyca, seler, siarczyny",
            },
          ],
          totalAllergens:
            "gluten, jaja, mleko, soja, gorczyca, seler, siarczyny",
        },
        {
          name: "Kanapka Pastrami",
          ingredients:
            "bułka maślana (pullman) (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos firmowy, colesław, mix sałata do wyboru, ogórek kiszony, pikle, pastrami, ser cheddar, cebula prażona",
          allergensList: [
            {
              item: "Bułka maślana (pullman)",
              allergens: "gluten (pszenica), jaja",
            },
            {
              item: "Colesław / mix sałata",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            {
              item: "Ogórek kiszony / pikle",
              allergens: "gorczyca, siarczyny",
            },
            {
              item: "Pastrami",
              allergens: "brak alergenów (jeśli bez dodatków funkcjonalnych)",
            },
            { item: "Ser cheddar", allergens: "mleko" },
            { item: "Cebula prażona", allergens: "gluten (pszenica)" },
          ],
          totalAllergens: "gluten, jaja, mleko, gorczyca, siarczyny",
        },
        {
          name: "Kanapka Cheesfries",
          ingredients:
            "mała bagietka, cebula grillowana, wołowina sezonowana 100% 200 g, sos do wyboru, boczek, ser cheddar, cebula prażona",
          allergensList: [
            { item: "Mała bagietka", allergens: "gluten (pszenica)" },
            { item: "Cebula grillowana", allergens: "brak alergenów" },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            { item: "Boczek", allergens: "brak alergenów" },
            { item: "Ser cheddar", allergens: "mleko" },
            { item: "Cebula prażona", allergens: "gluten (pszenica)" },
          ],
          totalAllergens: "gluten, mleko",
        },
        {
          name: "Kanapka Lowlanders",
          ingredients:
            "bułka do hot-dogu, sos, cebula prażona, mix sałat, pomidor, ogórek konserwowy (pikle), wędlina grillowana, boczek, ser cheddar",
          allergensList: [
            { item: "Bułka do hot-dogu", allergens: "gluten (pszenica)" },
            { item: "Cebula prażona", allergens: "gluten (pszenica)" },
            {
              item: "Mix sałat",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Pomidor", allergens: "brak alergenów" },
            {
              item: "Ogórek konserwowy (pikle)",
              allergens: "gorczyca, siarczyny",
            },
            {
              item: "Wędlina grillowana",
              allergens: "brak alergenów (jeśli bez dodatków funkcjonalnych)",
            },
            { item: "Boczek", allergens: "brak alergenów" },
            { item: "Ser cheddar", allergens: "mleko" },
          ],
          totalAllergens: "gluten, mleko, gorczyca, siarczyny",
        },
        {
          name: "Hot-dog",
          ingredients:
            "bułka do hot-doga (mąka pszenna typ 500, mąka żytnia typ 720 – do 20%, drożdże 2%, sól 0,3 %, woda), colesław, kiszona kapusta, ogórek konserwowy (pikle), jalapeño, cebula czerwona (do wyboru), kiełbasa, sos do wyboru, cebula prażona",
          allergensList: [
            { item: "Bułka do hot-doga", allergens: "gluten (pszenica, żyto)" },
            {
              item: "Colesław",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Kiszona kapusta", allergens: "brak alergenów" },
            {
              item: "Ogórek konserwowy (pikle)",
              allergens: "gorczyca, siarczyny",
            },
            { item: "Jalapeño", allergens: "brak alergenów" },
            { item: "Cebula czerwona", allergens: "brak alergenów" },
            {
              item: "Kiełbasa",
              allergens: "brak alergenów (jeśli bez dodatków funkcjonalnych)",
            },
            { item: "Cebula prażona", allergens: "gluten (pszenica)" },
          ],
          totalAllergens: "gluten, gorczyca, siarczyny",
        },
        {
          name: "Sałatka Cezar",
          ingredients:
            "mix sałata, pomidor cherry, kurczak z grilla, boczek, ser Parmezan, grzanki, sos Cezar",
          allergensList: [
            {
              item: "Mix sałata",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Pomidor cherry", allergens: "brak alergenów" },
            { item: "Kurczak z grilla", allergens: "brak alergenów" },
            { item: "Boczek", allergens: "brak alergenów" },
            { item: "Ser Parmezan", allergens: "mleko" },
            { item: "Grzanki", allergens: "gluten (pszenica)" },
            {
              item: "Sos Cezar",
              allergens:
                "jaja, mleko, musztarda, ryby (zależnie od producenta)",
            },
          ],
          totalAllergens: "gluten, jaja, mleko, musztarda, ryby",
        },
        {
          name: "Sałatka Wege",
          ingredients:
            "mix sałata, pomidor cherry, ogórek świeży, cukinia z grilla, ser halloumi, sos",
          allergensList: [
            {
              item: "Mix sałata",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Pomidor cherry", allergens: "brak alergenów" },
            { item: "Ogórek świeży", allergens: "brak alergenów" },
            { item: "Cukinia z grilla", allergens: "brak alergenów" },
            { item: "Ser halloumi", allergens: "mleko" },
          ],
          totalAllergens: "mleko",
        },
        {
          name: "Breakfast",
          ingredients:
            "jajko – 3 sztuki sadzone (jajecznica), boczek, wędlina grillowana (kiełbasa do hot-doga), mix sałata, grzanki, sos do wyboru",
          allergensList: [
            { item: "Jajko", allergens: "jaja" },
            { item: "Boczek", allergens: "brak alergenów" },
            {
              item: "Wędlina grillowana (kiełbasa do hot-doga)",
              allergens: "brak alergenów (jeśli bez dodatków funkcjonalnych)",
            },
            {
              item: "Mix sałata",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Grzanki", allergens: "gluten (pszenica)" },
          ],
          totalAllergens: "gluten, jaja",
        },
        {
          name: "Junior",
          ingredients:
            "bułka do hamburgera (mąka pszenna typ 500, olej roślinny, cukier, jaja), sos ketczunez / majonez, wołowina sezonowana 100% 100 g lub stripsy, mix sałat, pomidor, cebula czerwona, ogórek konserwowy (pikle) na życzenie dziecka",
          allergensList: [
            {
              item: "Bułka do hamburgera",
              allergens: "gluten (pszenica), jaja",
            },
            {
              item: "Sos ketczunez / majonez",
              allergens: "jaja, musztarda, soja, seler, siarczyny",
            },
            { item: "Wołowina sezonowana 100%", allergens: "brak alergenów" },
            {
              item: "Stripsy",
              allergens:
                "gluten (pszenica), jaja, mleko, soja (zależnie od panierki)",
              isAlternative: true,
            },
            {
              item: "Mix sałat",
              allergens: "brak alergenów (możliwe śladowe ilości)",
            },
            { item: "Pomidor", allergens: "brak alergenów" },
            { item: "Cebula czerwona", allergens: "brak alergenów" },
            {
              item: "Ogórek konserwowy (pikle)",
              allergens: "gorczyca, siarczyny",
            },
          ],
          totalAllergens:
            "gluten, jaja, mleko, soja, musztarda, seler, gorczyca, siarczyny",
        },
      ],
      additionalInfo: [
        "Stripsy mogą zawierać alergeny: gluten, jaja, mleko, soja, siarczyny – w zależności od producenta i sposobu przygotowania.",
        "Frytki mogą zawierać alergeny: gluten, soja, siarczyny – w zależności od sposobu przygotowania i użytej panierki. Frytki klasyczne smażone w czystym oleju: brak alergenów.",
        "Bataty mogą zawierać alergeny: gluten, soja, siarczyny – w zależności od sposobu przygotowania i użytej panierki. Bataty pieczone/smażone bez panierki: brak alergenów.",
        "Onion Rings mogą zawierać alergeny: gluten, jaja, mleko, soja, siarczyny – w zależności od użytej panierki i sposobu przygotowania.",
        "Paluszki serowe mogą zawierać alergeny: mleko, gluten, jaja, soja, siarczyny – w zależności od użytej panierki i sposobu przygotowania.",
        "Kulki serowe mogą zawierać alergeny: mleko, gluten, jaja, soja, siarczyny – w zależności od użytej panierki i sposobu przygotowania.",
        "Sos Salsa Mexicana (Fanex) może zawierać alergeny: soja, seler, siarczyny.",
        "Sos Meksykański (Fanex) może zawierać alergeny: soja, seler, siarczyny.",
        "Bardzo ostry sos z papryką chilli Carolina Reaper (Fanex) może zawierać alergeny: soja, seler, siarczyny.",
        "Sos serowy (Fanex) może zawierać alergeny: mleko, soja, siarczyny.",
        "Sos bazyliowy bez konserwantów (Fanex) – możliwe alergeny: gorczyca, jaja.",
      ],
      labels: {
        ingredients: "Składniki",
        allergensList: "Wykaz alergenów",
        totalAllergens: "Alergeny obecne w produkcie",
        disclaimer:
          "Produkt może powodować indywidualną nietolerancję niektórych składników.",
        or: "lub",
        additionalInfo: "Dodatkowe informacje o alergenach",
      },
    },
    en: {
      products: [
        {
          name: "Classic Burger",
          ingredients:
            "butter bun (wheat flour type 500, vegetable oil, sugar, eggs), sauce of choice, mixed lettuce, tomato, pickled cucumber (pickles), red onion, 100% seasoned beef 200g, or breaded chicken fillet",
          allergensList: [
            { item: "Butter bun", allergens: "gluten (wheat), eggs" },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Tomato", allergens: "no allergens" },
            { item: "Pickled cucumber", allergens: "mustard, sulfites" },
            { item: "Red onion", allergens: "no allergens" },
            { item: "100% seasoned beef", allergens: "no allergens" },
            {
              item: "Breaded chicken fillet",
              allergens: "gluten (wheat), eggs, milk, soy",
              isAlternative: true,
            },
          ],
          totalAllergens: "gluten, eggs, milk, soy, mustard, sulfites",
        },
        {
          name: "Cheeseburger",
          ingredients:
            "butter bun (wheat flour type 500, vegetable oil, sugar, eggs), sauce of choice, mixed lettuce, tomato, pickled cucumber (pickles), red onion, grilled onion, cheddar cheese, bacon, 100% seasoned beef 200g or breaded chicken fillet",
          allergensList: [
            { item: "Butter bun", allergens: "gluten (wheat), eggs" },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Tomato", allergens: "no allergens" },
            { item: "Pickled cucumber", allergens: "mustard, sulfites" },
            { item: "Red onion", allergens: "no allergens" },
            { item: "Grilled onion", allergens: "no allergens" },
            { item: "Cheddar cheese", allergens: "milk" },
            { item: "Bacon", allergens: "no allergens" },
            { item: "100% seasoned beef", allergens: "no allergens" },
            {
              item: "Breaded chicken fillet",
              allergens: "gluten (wheat), eggs, milk, soy",
              isAlternative: true,
            },
          ],
          totalAllergens: "gluten, eggs, milk, soy, mustard, sulfites",
        },
        {
          name: "BBQ Burger",
          ingredients:
            "butter bun (wheat flour type 500, vegetable oil, sugar, eggs), tartar sauce, mixed lettuce, tomato, 100% seasoned beef 200g caramelized with BBQ sauce, bacon, fried onions",
          allergensList: [
            { item: "Butter bun", allergens: "gluten (wheat), eggs" },
            {
              item: "Tartar sauce",
              allergens: "eggs, mustard, milk (possible), celery",
            },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Tomato", allergens: "no allergens" },
            { item: "100% seasoned beef", allergens: "no allergens" },
            {
              item: "BBQ sauce",
              allergens: "soy, mustard, sulfites (depending on manufacturer)",
            },
            { item: "Bacon", allergens: "no allergens" },
            { item: "Fried onions", allergens: "gluten (wheat)" },
          ],
          totalAllergens: "gluten, eggs, milk, soy, mustard, celery, sulfites",
        },
        {
          name: "English Burger",
          ingredients:
            "butter bun (wheat flour type 500, vegetable oil, sugar, eggs), sauce, mixed lettuce, tomato, pickled cucumber (pickles), 100% seasoned beef 200g, grilled onion, cheddar cheese, bacon, cold cuts, fried egg",
          allergensList: [
            { item: "Butter bun", allergens: "gluten (wheat), eggs" },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Tomato", allergens: "no allergens" },
            { item: "Pickled cucumber", allergens: "mustard, sulfites" },
            { item: "100% seasoned beef", allergens: "no allergens" },
            { item: "Grilled onion", allergens: "no allergens" },
            { item: "Cheddar cheese", allergens: "milk" },
            { item: "Bacon", allergens: "no allergens" },
            {
              item: "Cold cuts",
              allergens: "no allergens (if without functional additives)",
            },
            { item: "Fried egg", allergens: "eggs" },
          ],
          totalAllergens: "gluten, eggs, milk, mustard",
        },
        {
          name: "GastroFaza Burger",
          ingredients:
            "butter bun (wheat flour type 500, vegetable oil, sugar, eggs), sauce, fried onions, mixed lettuce, pickled cucumber (pickles), 2× 100% seasoned beef patty (2×200g), bacon ×2, cheddar cheese ×2, cold cuts ×2, grilled onion",
          allergensList: [
            { item: "Butter bun", allergens: "gluten (wheat), eggs" },
            { item: "Fried onions", allergens: "gluten (wheat)" },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Pickled cucumber", allergens: "mustard, sulfites" },
            { item: "100% seasoned beef", allergens: "no allergens" },
            { item: "Bacon", allergens: "no allergens" },
            { item: "Cheddar cheese", allergens: "milk" },
            {
              item: "Cold cuts",
              allergens: "no allergens (if without functional additives)",
            },
            { item: "Grilled onion", allergens: "no allergens" },
          ],
          totalAllergens: "gluten, eggs, milk, mustard, sulfites",
        },
        {
          name: "Veggie Burger",
          ingredients:
            "veggie bun, veggie sauce, mixed lettuce, tomato, fresh cucumber, red onion, grilled zucchini, halloumi cheese 200g",
          allergensList: [
            { item: "Veggie bun", allergens: "gluten (wheat) (if wheat bun)" },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Tomato", allergens: "no allergens" },
            { item: "Fresh cucumber", allergens: "no allergens" },
            { item: "Red onion", allergens: "no allergens" },
            { item: "Grilled zucchini", allergens: "no allergens" },
            { item: "Halloumi cheese", allergens: "milk" },
          ],
          totalAllergens: "gluten, milk",
        },
        {
          name: '"Lumberjack" Burger',
          ingredients:
            "butter bun (wheat flour type 500, vegetable oil, sugar, eggs), house sauce, fried onions, mixed lettuce, red onion, 100% seasoned beef 200g, bacon, breaded cheese, cranberry",
          allergensList: [
            { item: "Butter bun", allergens: "gluten (wheat), eggs" },
            { item: "Fried onions", allergens: "gluten (wheat)" },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Red onion", allergens: "no allergens" },
            { item: "100% seasoned beef", allergens: "no allergens" },
            { item: "Bacon", allergens: "no allergens" },
            { item: "Breaded cheese", allergens: "gluten (wheat), milk, eggs" },
            {
              item: "Cranberry",
              allergens: "no allergens (if without preservatives)",
            },
          ],
          totalAllergens: "gluten, eggs, milk",
        },
        {
          name: "Smash Burger",
          ingredients:
            "butter bun (wheat flour type 500, vegetable oil, sugar, eggs), sauce of choice, grilled onion, pickles or jalapeño of choice, 2×100g 100% seasoned beef, cheddar cheese, bacon",
          allergensList: [
            { item: "Butter bun", allergens: "gluten (wheat), eggs" },
            { item: "Grilled onion", allergens: "no allergens" },
            {
              item: "Pickled cucumber (pickles)",
              allergens: "mustard, sulfites",
            },
            {
              item: "Jalapeño",
              allergens: "no allergens (if without preservatives)",
            },
            { item: "100% seasoned beef", allergens: "no allergens" },
            { item: "Cheddar cheese", allergens: "milk" },
            { item: "Bacon", allergens: "no allergens" },
          ],
          totalAllergens: "gluten, eggs, milk, mustard, sulfites",
        },
        {
          name: '"Highlander" Burger',
          ingredients:
            "butter bun (wheat flour type 500, vegetable oil, sugar, eggs), BBQ sauce + cranberry (Fanex), arugula, red onion, 100% seasoned beef 200g, grilled onion, oscypek cheese, bacon",
          allergensList: [
            { item: "Butter bun", allergens: "gluten (wheat), eggs" },
            { item: "Arugula", allergens: "no allergens" },
            { item: "Red onion", allergens: "no allergens" },
            { item: "100% seasoned beef", allergens: "no allergens" },
            { item: "Grilled onion", allergens: "no allergens" },
            { item: "Oscypek cheese", allergens: "milk" },
            { item: "Bacon", allergens: "no allergens" },
            {
              item: "BBQ sauce + cranberry (Fanex)",
              allergens: "soy, mustard, celery, sulfites",
            },
          ],
          totalAllergens: "gluten, eggs, milk, soy, mustard, celery, sulfites",
        },
        {
          name: "Bacon-Wrapped Chicken Burger",
          ingredients:
            "butter bun (wheat flour type 500, vegetable oil, sugar, eggs), BBQ sauce (Fanex), mixed lettuce, pickled cucumber (pickles), red onion, bacon-wrapped chicken 200g, cheddar cheese, plum (cranberry)",
          allergensList: [
            { item: "Butter bun", allergens: "gluten (wheat), eggs" },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            {
              item: "Pickled cucumber (pickles)",
              allergens: "mustard, sulfites",
            },
            { item: "Red onion", allergens: "no allergens" },
            {
              item: "Bacon-wrapped chicken",
              allergens: "no allergens (if without breading and additives)",
            },
            { item: "Cheddar cheese", allergens: "milk" },
            {
              item: "Plum / cranberry",
              allergens: "sulfites (if preservatives used)",
            },
            {
              item: "BBQ sauce (Fanex)",
              allergens: "soy, mustard, celery, sulfites",
            },
          ],
          totalAllergens: "gluten, eggs, milk, soy, mustard, celery, sulfites",
        },
        {
          name: "Pastrami Sandwich",
          ingredients:
            "butter bun (pullman) (wheat flour type 500, vegetable oil, sugar, eggs), house sauce, coleslaw, mixed lettuce of choice, sour cucumber, pickles, pastrami, cheddar cheese, fried onions",
          allergensList: [
            { item: "Butter bun (pullman)", allergens: "gluten (wheat), eggs" },
            {
              item: "Coleslaw / mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Sour cucumber / pickles", allergens: "mustard, sulfites" },
            {
              item: "Pastrami",
              allergens: "no allergens (if without functional additives)",
            },
            { item: "Cheddar cheese", allergens: "milk" },
            { item: "Fried onions", allergens: "gluten (wheat)" },
          ],
          totalAllergens: "gluten, eggs, milk, mustard, sulfites",
        },
        {
          name: "Cheesfries Sandwich",
          ingredients:
            "small baguette, grilled onion, 100% seasoned beef 200g, sauce of choice, bacon, cheddar cheese, fried onions",
          allergensList: [
            { item: "Small baguette", allergens: "gluten (wheat)" },
            { item: "Grilled onion", allergens: "no allergens" },
            { item: "100% seasoned beef", allergens: "no allergens" },
            { item: "Bacon", allergens: "no allergens" },
            { item: "Cheddar cheese", allergens: "milk" },
            { item: "Fried onions", allergens: "gluten (wheat)" },
          ],
          totalAllergens: "gluten, milk",
        },
        {
          name: "Lowlanders Sandwich",
          ingredients:
            "hot dog bun, sauce, fried onions, mixed lettuce, tomato, pickled cucumber (pickles), grilled cold cuts, bacon, cheddar cheese",
          allergensList: [
            { item: "Hot dog bun", allergens: "gluten (wheat)" },
            { item: "Fried onions", allergens: "gluten (wheat)" },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Tomato", allergens: "no allergens" },
            {
              item: "Pickled cucumber (pickles)",
              allergens: "mustard, sulfites",
            },
            {
              item: "Grilled cold cuts",
              allergens: "no allergens (if without functional additives)",
            },
            { item: "Bacon", allergens: "no allergens" },
            { item: "Cheddar cheese", allergens: "milk" },
          ],
          totalAllergens: "gluten, milk, mustard, sulfites",
        },
        {
          name: "Hot Dog",
          ingredients:
            "hot dog bun (wheat flour type 500, rye flour type 720 – up to 20%, yeast 2%, salt 0.3%, water), coleslaw, sauerkraut, pickled cucumber (pickles), jalapeño, red onion (optional), sausage, sauce of choice, fried onions",
          allergensList: [
            { item: "Hot dog bun", allergens: "gluten (wheat, rye)" },
            {
              item: "Coleslaw",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Sauerkraut", allergens: "no allergens" },
            {
              item: "Pickled cucumber (pickles)",
              allergens: "mustard, sulfites",
            },
            { item: "Jalapeño", allergens: "no allergens" },
            { item: "Red onion", allergens: "no allergens" },
            {
              item: "Sausage",
              allergens: "no allergens (if without functional additives)",
            },
            { item: "Fried onions", allergens: "gluten (wheat)" },
          ],
          totalAllergens: "gluten, mustard, sulfites",
        },
        {
          name: "Caesar Salad",
          ingredients:
            "mixed lettuce, cherry tomato, grilled chicken, bacon, Parmesan cheese, croutons, Caesar sauce",
          allergensList: [
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Cherry tomato", allergens: "no allergens" },
            { item: "Grilled chicken", allergens: "no allergens" },
            { item: "Bacon", allergens: "no allergens" },
            { item: "Parmesan cheese", allergens: "milk" },
            { item: "Croutons", allergens: "gluten (wheat)" },
            {
              item: "Caesar sauce",
              allergens:
                "eggs, milk, mustard, fish (depending on manufacturer)",
            },
          ],
          totalAllergens: "gluten, eggs, milk, mustard, fish",
        },
        {
          name: "Veggie Salad",
          ingredients:
            "mixed lettuce, cherry tomato, fresh cucumber, grilled zucchini, halloumi cheese, sauce",
          allergensList: [
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Cherry tomato", allergens: "no allergens" },
            { item: "Fresh cucumber", allergens: "no allergens" },
            { item: "Grilled zucchini", allergens: "no allergens" },
            { item: "Halloumi cheese", allergens: "milk" },
          ],
          totalAllergens: "milk",
        },
        {
          name: "Breakfast",
          ingredients:
            "egg – 3 pieces fried (scrambled), bacon, grilled cold cuts (hot dog sausage), mixed lettuce, croutons, sauce of choice",
          allergensList: [
            { item: "Egg", allergens: "eggs" },
            { item: "Bacon", allergens: "no allergens" },
            {
              item: "Grilled cold cuts (hot dog sausage)",
              allergens: "no allergens (if without functional additives)",
            },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Croutons", allergens: "gluten (wheat)" },
          ],
          totalAllergens: "gluten, eggs",
        },
        {
          name: "Junior",
          ingredients:
            "hamburger bun (wheat flour type 500, vegetable oil, sugar, eggs), ketchunez / mayonnaise sauce, 100% seasoned beef 100g or strips, mixed lettuce, tomato, red onion, pickled cucumber (pickles) on child's request",
          allergensList: [
            { item: "Hamburger bun", allergens: "gluten (wheat), eggs" },
            {
              item: "Ketchunez / mayonnaise sauce",
              allergens: "eggs, mustard, soy, celery, sulfites",
            },
            { item: "100% seasoned beef", allergens: "no allergens" },
            {
              item: "Strips",
              allergens:
                "gluten (wheat), eggs, milk, soy (depending on breading)",
              isAlternative: true,
            },
            {
              item: "Mixed lettuce",
              allergens: "no allergens (possible trace amounts)",
            },
            { item: "Tomato", allergens: "no allergens" },
            { item: "Red onion", allergens: "no allergens" },
            {
              item: "Pickled cucumber (pickles)",
              allergens: "mustard, sulfites",
            },
          ],
          totalAllergens: "gluten, eggs, milk, soy, mustard, celery, sulfites",
        },
      ],
      additionalInfo: [
        "Strips may contain allergens: gluten, eggs, milk, soy, sulfites – depending on manufacturer and preparation method.",
        "Fries may contain allergens: gluten, soy, sulfites – depending on preparation method and breading used. Classic fries fried in pure oil: no allergens.",
        "Sweet potatoes may contain allergens: gluten, soy, sulfites – depending on preparation method and breading used. Baked/fried sweet potatoes without breading: no allergens.",
        "Onion Rings may contain allergens: gluten, eggs, milk, soy, sulfites – depending on breading used and preparation method.",
        "Cheese sticks may contain allergens: milk, gluten, eggs, soy, sulfites – depending on breading used and preparation method.",
        "Cheese balls may contain allergens: milk, gluten, eggs, soy, sulfites – depending on breading used and preparation method.",
        "Salsa Mexicana sauce (Fanex) may contain allergens: soy, celery, sulfites.",
        "Mexican sauce (Fanex) may contain allergens: soy, celery, sulfites.",
        "Very hot sauce with Carolina Reaper chili pepper (Fanex) may contain allergens: soy, celery, sulfites.",
        "Cheese sauce (Fanex) may contain allergens: milk, soy, sulfites.",
        "Basil sauce without preservatives (Fanex) – possible allergens: mustard, eggs.",
      ],
      labels: {
        ingredients: "Ingredients",
        allergensList: "Allergen breakdown",
        totalAllergens: "Allergens present in the product",
        disclaimer:
          "The product may cause individual intolerance to certain ingredients.",
        or: "or",
        additionalInfo: "Additional allergen information",
      },
    },
    ru: {
      products: [
        {
          name: "Классический бургер",
          ingredients:
            "сливочная булочка (пшеничная мука тип 500, растительное масло, сахар, яйца), соус на выбор, микс салата, помидор, маринованный огурец (пикули), красный лук, 100% приправленная говядина 200 г или панированное куриное филе",
          allergensList: [
            { item: "Сливочная булочка", allergens: "глютен (пшеница), яйца" },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Помидор", allergens: "без аллергенов" },
            { item: "Маринованный огурец", allergens: "горчица, сульфиты" },
            { item: "Красный лук", allergens: "без аллергенов" },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            {
              item: "Панированное куриное филе",
              allergens: "глютен (пшеница), яйца, молоко, соя",
              isAlternative: true,
            },
          ],
          totalAllergens: "глютен, яйца, молоко, соя, горчица, сульфиты",
        },
        {
          name: "Чизбургер",
          ingredients:
            "сливочная булочка (пшеничная мука тип 500, растительное масло, сахар, яйца), соус на выбор, микс салата, помидор, маринованный огурец (пикули), красный лук, жареный лук, сыр чеддер, бекон, 100% приправленная говядина 200 г или панированное куриное филе",
          allergensList: [
            { item: "Сливочная булочка", allergens: "глютен (пшеница), яйца" },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Помидор", allergens: "без аллергенов" },
            { item: "Маринованный огурец", allergens: "горчица, сульфиты" },
            { item: "Красный лук", allergens: "без аллергенов" },
            { item: "Жареный лук", allergens: "без аллергенов" },
            { item: "Сыр чеддер", allergens: "молоко" },
            { item: "Бекон", allergens: "без аллергенов" },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            {
              item: "Панированное куриное филе",
              allergens: "глютен (пшеница), яйца, молоко, соя",
              isAlternative: true,
            },
          ],
          totalAllergens: "глютен, яйца, молоко, соя, горчица, сульфиты",
        },
        {
          name: "Бургер BBQ",
          ingredients:
            "сливочная булочка (пшеничная мука тип 500, растительное масло, сахар, яйца), соус тартар, микс салата, помидор, 100% приправленная говядина 200 г карамелизованная соусом BBQ, бекон, жареный лук",
          allergensList: [
            { item: "Сливочная булочка", allergens: "глютен (пшеница), яйца" },
            {
              item: "Соус тартар",
              allergens: "яйца, горчица, молоко (возможно), сельдерей",
            },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Помидор", allergens: "без аллергенов" },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            {
              item: "Соус BBQ",
              allergens:
                "соя, горчица, сульфиты (в зависимости от производителя)",
            },
            { item: "Бекон", allergens: "без аллергенов" },
            { item: "Жареный лук", allergens: "глютен (пшеница)" },
          ],
          totalAllergens:
            "глютен, яйца, молоко, соя, горчица, сельдерей, сульфиты",
        },
        {
          name: "Английский бургер",
          ingredients:
            "сливочная булочка (пшеничная мука тип 500, растительное масло, сахар, яйца), соус, микс салата, помидор, маринованный огурец (пикули), 100% приправленная говядина 200 г, жареный лук, сыр чеддер, бекон, колбаса, яичница",
          allergensList: [
            { item: "Сливочная булочка", allergens: "глютен (пшеница), яйца" },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Помидор", allergens: "без аллергенов" },
            { item: "Маринованный огурец", allergens: "горчица, сульфиты" },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            { item: "Жареный лук", allergens: "без аллергенов" },
            { item: "Сыр чеддер", allergens: "молоко" },
            { item: "Бекон", allergens: "без аллергенов" },
            {
              item: "Колбаса",
              allergens: "без аллергенов (если без функциональных добавок)",
            },
            { item: "Яичница", allergens: "яйца" },
          ],
          totalAllergens: "глютен, яйца, молоко, горчица",
        },
        {
          name: "Бургер GastroFaza",
          ingredients:
            "сливочная булочка (пшеничная мука тип 500, растительное масло, сахар, яйца), соус, жареный лук, микс салата, маринованный огурец (пикули), 2× котлета из 100% приправленной говядины (2×200 г), бекон ×2, сыр чеддер ×2, колбаса ×2, жареный лук",
          allergensList: [
            { item: "Сливочная булочка", allergens: "глютен (пшеница), яйца" },
            { item: "Жареный лук", allergens: "глютен (пшеница)" },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Маринованный огурец", allergens: "горчица, сульфиты" },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            { item: "Бекон", allergens: "без аллергенов" },
            { item: "Сыр чеддер", allergens: "молоко" },
            {
              item: "Колбаса",
              allergens: "без аллергенов (если без функциональных добавок)",
            },
            { item: "Жареный лук", allergens: "без аллергенов" },
          ],
          totalAllergens: "глютен, яйца, молоко, горчица, сульфиты",
        },
        {
          name: "Вегетарианский бургер",
          ingredients:
            "вегетарианская булочка, вегетарианский соус, микс салата, помидор, свежий огурец, красный лук, цукини на гриле, сыр халлуми 200 г",
          allergensList: [
            {
              item: "Вегетарианская булочка",
              allergens: "глютен (пшеница) (если пшеничная булочка)",
            },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Помидор", allergens: "без аллергенов" },
            { item: "Свежий огурец", allergens: "без аллергенов" },
            { item: "Красный лук", allergens: "без аллергенов" },
            { item: "Цукини на гриле", allergens: "без аллергенов" },
            { item: "Сыр халлуми", allergens: "молоко" },
          ],
          totalAllergens: "глютен, молоко",
        },
        {
          name: "Бургер «Лесоруб»",
          ingredients:
            "сливочная булочка (пшеничная мука тип 500, растительное масло, сахар, яйца), фирменный соус, жареный лук, микс салата, красный лук, 100% приправленная говядина 200 г, бекон, панированный сыр, клюква",
          allergensList: [
            { item: "Сливочная булочка", allergens: "глютен (пшеница), яйца" },
            { item: "Жареный лук", allergens: "глютен (пшеница)" },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Красный лук", allergens: "без аллергенов" },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            { item: "Бекон", allergens: "без аллергенов" },
            {
              item: "Панированный сыр",
              allergens: "глютен (пшеница), молоко, яйца",
            },
            {
              item: "Клюква",
              allergens: "без аллергенов (если без консервантов)",
            },
          ],
          totalAllergens: "глютен, яйца, молоко",
        },
        {
          name: "Смэш бургер",
          ingredients:
            "сливочная булочка (пшеничная мука тип 500, растительное масло, сахар, яйца), соус на выбор, жареный лук, пикули или халапеньо на выбор, 2×100 г 100% приправленная говядина, сыр чеддер, бекон",
          allergensList: [
            { item: "Сливочная булочка", allergens: "глютен (пшеница), яйца" },
            { item: "Жареный лук", allergens: "без аллергенов" },
            {
              item: "Маринованный огурец (пикули)",
              allergens: "горчица, сульфиты",
            },
            {
              item: "Халапеньо",
              allergens: "без аллергенов (если без консервантов)",
            },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            { item: "Сыр чеддер", allergens: "молоко" },
            { item: "Бекон", allergens: "без аллергенов" },
          ],
          totalAllergens: "глютен, яйца, молоко, горчица, сульфиты",
        },
        {
          name: "Бургер «Горец»",
          ingredients:
            "сливочная булочка (пшеничная мука тип 500, растительное масло, сахар, яйца), соус BBQ + клюква (Fanex), руккола, красный лук, 100% приправленная говядина 200 г, жареный лук, сыр осцыпек, бекон",
          allergensList: [
            { item: "Сливочная булочка", allergens: "глютен (пшеница), яйца" },
            { item: "Руккола", allergens: "без аллергенов" },
            { item: "Красный лук", allergens: "без аллергенов" },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            { item: "Жареный лук", allergens: "без аллергенов" },
            { item: "Сыр осцыпек", allergens: "молоко" },
            { item: "Бекон", allergens: "без аллергенов" },
            {
              item: "Соус BBQ + клюква (Fanex)",
              allergens: "соя, горчица, сельдерей, сульфиты",
            },
          ],
          totalAllergens:
            "глютен, яйца, молоко, соя, горчица, сельдерей, сульфиты",
        },
        {
          name: "Бургер с курицей в беконе",
          ingredients:
            "сливочная булочка (пшеничная мука тип 500, растительное масло, сахар, яйца), соус BBQ (Fanex), микс салата, маринованный огурец (пикули), красный лук, курица завёрнутая в бекон 200 г, сыр чеддер, слива (клюква)",
          allergensList: [
            { item: "Сливочная булочка", allergens: "глютен (пшеница), яйца" },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            {
              item: "Маринованный огурец (пикули)",
              allergens: "горчица, сульфиты",
            },
            { item: "Красный лук", allergens: "без аллергенов" },
            {
              item: "Курица завёрнутая в бекон",
              allergens: "без аллергенов (если без панировки и добавок)",
            },
            { item: "Сыр чеддер", allergens: "молоко" },
            {
              item: "Слива / клюква",
              allergens: "сульфиты (если использованы консерванты)",
            },
            {
              item: "Соус BBQ (Fanex)",
              allergens: "соя, горчица, сельдерей, сульфиты",
            },
          ],
          totalAllergens:
            "глютен, яйца, молоко, соя, горчица, сельдерей, сульфиты",
        },
        {
          name: "Сэндвич Пастрами",
          ingredients:
            "сливочная булочка (пульман) (пшеничная мука тип 500, растительное масло, сахар, яйца), фирменный соус, коулслоу, микс салата на выбор, солёный огурец, пикули, пастрами, сыр чеддер, жареный лук",
          allergensList: [
            {
              item: "Сливочная булочка (пульман)",
              allergens: "глютен (пшеница), яйца",
            },
            {
              item: "Коулслоу / микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Солёный огурец / пикули", allergens: "горчица, сульфиты" },
            {
              item: "Пастрами",
              allergens: "без аллергенов (если без функциональных добавок)",
            },
            { item: "Сыр чеддер", allergens: "молоко" },
            { item: "Жареный лук", allergens: "глютен (пшеница)" },
          ],
          totalAllergens: "глютен, яйца, молоко, горчица, сульфиты",
        },
        {
          name: "Сэндвич Чизфрайс",
          ingredients:
            "маленький багет, жареный лук, 100% приправленная говядина 200 г, соус на выбор, бекон, сыр чеддер, жареный лук",
          allergensList: [
            { item: "Маленький багет", allergens: "глютен (пшеница)" },
            { item: "Жареный лук", allergens: "без аллергенов" },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            { item: "Бекон", allergens: "без аллергенов" },
            { item: "Сыр чеддер", allergens: "молоко" },
            { item: "Жареный лук", allergens: "глютен (пшеница)" },
          ],
          totalAllergens: "глютен, молоко",
        },
        {
          name: "Сэндвич Лоулэндерс",
          ingredients:
            "булочка для хот-дога, соус, жареный лук, микс салата, помидор, маринованный огурец (пикули), колбаса на гриле, бекон, сыр чеддер",
          allergensList: [
            { item: "Булочка для хот-дога", allergens: "глютен (пшеница)" },
            { item: "Жареный лук", allergens: "глютен (пшеница)" },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Помидор", allergens: "без аллергенов" },
            {
              item: "Маринованный огурец (пикули)",
              allergens: "горчица, сульфиты",
            },
            {
              item: "Колбаса на гриле",
              allergens: "без аллергенов (если без функциональных добавок)",
            },
            { item: "Бекон", allergens: "без аллергенов" },
            { item: "Сыр чеддер", allergens: "молоко" },
          ],
          totalAllergens: "глютен, молоко, горчица, сульфиты",
        },
        {
          name: "Хот-дог",
          ingredients:
            "булочка для хот-дога (пшеничная мука тип 500, ржаная мука тип 720 – до 20%, дрожжи 2%, соль 0,3%, вода), коулслоу, квашеная капуста, маринованный огурец (пикули), халапеньо, красный лук (на выбор), сосиска, соус на выбор, жареный лук",
          allergensList: [
            {
              item: "Булочка для хот-дога",
              allergens: "глютен (пшеница, рожь)",
            },
            {
              item: "Коулслоу",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Квашеная капуста", allergens: "без аллергенов" },
            {
              item: "Маринованный огурец (пикули)",
              allergens: "горчица, сульфиты",
            },
            { item: "Халапеньо", allergens: "без аллергенов" },
            { item: "Красный лук", allergens: "без аллергенов" },
            {
              item: "Сосиска",
              allergens: "без аллергенов (если без функциональных добавок)",
            },
            { item: "Жареный лук", allergens: "глютен (пшеница)" },
          ],
          totalAllergens: "глютен, горчица, сульфиты",
        },
        {
          name: "Салат Цезарь",
          ingredients:
            "микс салата, помидоры черри, курица на гриле, бекон, сыр Пармезан, гренки, соус Цезарь",
          allergensList: [
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Помидоры черри", allergens: "без аллергенов" },
            { item: "Курица на гриле", allergens: "без аллергенов" },
            { item: "Бекон", allergens: "без аллергенов" },
            { item: "Сыр Пармезан", allergens: "молоко" },
            { item: "Гренки", allergens: "глютен (пшеница)" },
            {
              item: "Соус Цезарь",
              allergens:
                "яйца, молоко, горчица, рыба (в зависимости от производителя)",
            },
          ],
          totalAllergens: "глютен, яйца, молоко, горчица, рыба",
        },
        {
          name: "Вегетарианский салат",
          ingredients:
            "микс салата, помидоры черри, свежий огурец, цукини на гриле, сыр халлуми, соус",
          allergensList: [
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Помидоры черри", allergens: "без аллергенов" },
            { item: "Свежий огурец", allergens: "без аллергенов" },
            { item: "Цукини на гриле", allergens: "без аллергенов" },
            { item: "Сыр халлуми", allergens: "молоко" },
          ],
          totalAllergens: "молоко",
        },
        {
          name: "Завтрак",
          ingredients:
            "яйцо – 3 штуки жареные (яичница), бекон, колбаса на гриле (сосиска для хот-дога), микс салата, гренки, соус на выбор",
          allergensList: [
            { item: "Яйцо", allergens: "яйца" },
            { item: "Бекон", allergens: "без аллергенов" },
            {
              item: "Колбаса на гриле (сосиска для хот-дога)",
              allergens: "без аллергенов (если без функциональных добавок)",
            },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Гренки", allergens: "глютен (пшеница)" },
          ],
          totalAllergens: "глютен, яйца",
        },
        {
          name: "Джуниор",
          ingredients:
            "булочка для гамбургера (пшеничная мука тип 500, растительное масло, сахар, яйца), соус кетчунез / майонез, 100% приправленная говядина 100 г или стрипсы, микс салата, помидор, красный лук, маринованный огурец (пикули) по желанию ребёнка",
          allergensList: [
            {
              item: "Булочка для гамбургера",
              allergens: "глютен (пшеница), яйца",
            },
            {
              item: "Соус кетчунез / майонез",
              allergens: "яйца, горчица, соя, сельдерей, сульфиты",
            },
            {
              item: "100% приправленная говядина",
              allergens: "без аллергенов",
            },
            {
              item: "Стрипсы",
              allergens:
                "глютен (пшеница), яйца, молоко, соя (в зависимости от панировки)",
              isAlternative: true,
            },
            {
              item: "Микс салата",
              allergens: "без аллергенов (возможны следовые количества)",
            },
            { item: "Помидор", allergens: "без аллергенов" },
            { item: "Красный лук", allergens: "без аллергенов" },
            {
              item: "Маринованный огурец (пикули)",
              allergens: "горчица, сульфиты",
            },
          ],
          totalAllergens:
            "глютен, яйца, молоко, соя, горчица, сельдерей, сульфиты",
        },
      ],
      additionalInfo: [
        "Стрипсы могут содержать аллергены: глютен, яйца, молоко, соя, сульфиты – в зависимости от производителя и способа приготовления.",
        "Картофель фри может содержать аллергены: глютен, соя, сульфиты – в зависимости от способа приготовления и используемой панировки. Классический картофель фри, жаренный в чистом масле: без аллергенов.",
        "Батат может содержать аллергены: глютен, соя, сульфиты – в зависимости от способа приготовления и используемой панировки. Запечённый/жареный батат без панировки: без аллергенов.",
        "Луковые кольца могут содержать аллергены: глютен, яйца, молоко, соя, сульфиты – в зависимости от используемой панировки и способа приготовления.",
        "Сырные палочки могут содержать аллергены: молоко, глютен, яйца, соя, сульфиты – в зависимости от используемой панировки и способа приготовления.",
        "Сырные шарики могут содержать аллергены: молоко, глютен, яйца, соя, сульфиты – в зависимости от используемой панировки и способа приготовления.",
        "Соус Сальса Мексикана (Fanex) может содержать аллергены: соя, сельдерей, сульфиты.",
        "Мексиканский соус (Fanex) может содержать аллергены: соя, сельдерей, сульфиты.",
        "Очень острый соус с перцем чили Carolina Reaper (Fanex) может содержать аллергены: соя, сельдерей, сульфиты.",
        "Сырный соус (Fanex) может содержать аллергены: молоко, соя, сульфиты.",
        "Соус с базиликом без консервантов (Fanex) – возможные аллергены: горчица, яйца.",
      ],
      labels: {
        ingredients: "Состав",
        allergensList: "Перечень аллергенов",
        totalAllergens: "Аллергены, присутствующие в продукте",
        disclaimer:
          "Продукт может вызвать индивидуальную непереносимость некоторых ингредиентов.",
        or: "или",
        additionalInfo: "Дополнительная информация об аллергенах",
      },
    },
  };

  const currentLang = i18n.language || "en";
  const data = allergensData[currentLang] || allergensData.en;
  const totalProducts = data.products.length;
  const currentProduct = data.products[currentPage];

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalProducts - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalProducts - 1 ? prev + 1 : 0));
  };

  const handleClose = () => {
    setCurrentPage(0);
    setShowAdditionalInfo(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="allergens-overlay" onClick={handleClose}>
      <div className="allergens-modal" onClick={(e) => e.stopPropagation()}>
        <button className="allergens-close" onClick={handleClose}>
          ×
        </button>

        <h1>{t("allergens.title")}</h1>

        <div className="allergens-tabs">
          <button
            className={`tab-btn ${!showAdditionalInfo ? "active" : ""}`}
            onClick={() => setShowAdditionalInfo(false)}
          >
            {currentLang === "pl"
              ? "Produkty"
              : currentLang === "ru"
                ? "Продукты"
                : "Products"}
          </button>
          <button
            className={`tab-btn ${showAdditionalInfo ? "active" : ""}`}
            onClick={() => setShowAdditionalInfo(true)}
          >
            {currentLang === "pl"
              ? "Dodatkowe info"
              : currentLang === "ru"
                ? "Доп. информация"
                : "Additional Info"}
          </button>
        </div>

        {!showAdditionalInfo ? (
          <>
            <div className="allergens-content">
              <div className="allergen-product">
                <h2>{currentProduct.name}</h2>

                <div className="allergen-section">
                  <h3>{data.labels.ingredients}:</h3>
                  <p>{currentProduct.ingredients}</p>
                </div>

                <div className="allergen-section">
                  <h3>{data.labels.allergensList}:</h3>
                  <ul>
                    {currentProduct.allergensList.map((allergen, idx) => (
                      <li
                        key={idx}
                        className={allergen.isAlternative ? "alternative" : ""}
                      >
                        {allergen.isAlternative && (
                          <span className="or-label">{data.labels.or} </span>
                        )}
                        <strong>{allergen.item}:</strong> {allergen.allergens}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="allergen-section total-allergens">
                  <h3>{data.labels.totalAllergens}:</h3>
                  <p className="allergens-highlight">
                    {currentProduct.totalAllergens}
                  </p>
                  <p className="disclaimer">{data.labels.disclaimer}</p>
                </div>
              </div>
            </div>

            <div className="allergens-pagination">
              <button className="pagination-btn" onClick={handlePrev}>
                ‹{" "}
                {currentLang === "pl"
                  ? "Poprzedni"
                  : currentLang === "ru"
                    ? "Назад"
                    : "Previous"}
              </button>

              <div className="pagination-info">
                <span className="page-number">{currentPage + 1}</span>
                <span className="page-separator">/</span>
                <span className="page-total">{totalProducts}</span>
              </div>

              <button className="pagination-btn" onClick={handleNext}>
                {currentLang === "pl"
                  ? "Następny"
                  : currentLang === "ru"
                    ? "Далее"
                    : "Next"}{" "}
                ›
              </button>
            </div>

            <div className="product-dots">
              {data.products.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(index)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="allergens-content">
            <div className="additional-info">
              <h2>{data.labels.additionalInfo}</h2>
              <ul>
                {data.additionalInfo.map((info, index) => (
                  <li key={index}>{info}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Allergens;
