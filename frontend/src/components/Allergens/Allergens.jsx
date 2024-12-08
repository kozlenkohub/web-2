import React from 'react';
import './Allergens.css';
import { useTranslation } from 'react-i18next';

const Allergens = () => {
  const { t, i18n } = useTranslation();

  const allergensData = {
    en: [
      { name: 'Onion rings in beer batter 1 kg', allergens: 'gluten, milk and its derivatives' },
      { name: 'Grana Padano Del Casale DOP cheese approx. 1 kg', allergens: 'eggs' },
      { name: 'Mexican salsa sauce 1 kg', allergens: 'gluten, soy' },
      { name: 'Anchovy fillets 78/42 g', allergens: 'fish' },
      { name: 'Chili pepper paste Gochujang 500 g', allergens: 'gluten, soy' },
      { name: 'Decorative mayonnaise 10 g x 120 pcs.', allergens: 'mustard, eggs' },
      { name: 'Crispy frozen chicken nuggets 1.5 kg', allergens: 'gluten' },
      { name: 'Fried onions 500 g', allergens: 'gluten' },
      { name: 'Mayonnaise 5 kg', allergens: 'mustard, eggs' },
      { name: 'Mozzarella cheese sticks 1 kg', allergens: 'gluten, milk and its derivatives' },
      { name: 'Breaded cheese balls 1 kg', allergens: 'gluten, milk and its derivatives' },
      { name: 'Mexican sauce 1 kg', allergens: 'mustard' },
      { name: 'Crispy frozen chicken strips 1.5 kg', allergens: 'gluten' },
      { name: 'Grill cheese type halloumi 200 g', allergens: 'milk and its derivatives' },
      {
        name: 'Crispy breaded cheese frozen 125 g x 28 pcs. 3.5 kg',
        allergens: 'eggs, gluten, milk and its derivatives',
      },
      { name: 'Exquisite ham slices approx. 500 g', allergens: 'soy' },
      { name: 'Swedish salad 2.5/1.2 kg', allergens: 'mustard' },
      { name: 'Cheddar cheese slices (84 x 12 g) 1.033 kg', allergens: 'milk and its derivatives' },
    ],
    pl: [
      { name: 'Krążki cebulowe w cieście piwnym 1 kg', allergens: 'gluten, mleko i jego pochodne' },
      { name: 'Ser Grana Padano Del Casale DOP ok. 1 kg', allergens: 'jaja' },
      { name: 'Sos salsa mexicana 1 kg', allergens: 'gluten, soja' },
      { name: 'Anchois filety 78/42 g', allergens: 'ryba' },
      { name: 'Pasta z papryczek chili Gochujang 500 g', allergens: 'gluten, soja' },
      { name: 'Majonez dekoracyjny 10 g x 120 szt.', allergens: 'gorczyca, jaja' },
      { name: 'Nuggetsy z kurczaka crispy mrożone 1,5 kg', allergens: 'gluten' },
      { name: 'Cebulka prażona 500 g', allergens: 'gluten' },
      { name: 'Majonez 5 kg', allergens: 'gorczyca, jaja' },
      { name: 'Paluszki z sera mozzarella 1 kg', allergens: 'gluten, mleko i jego pochodne' },
      {
        name: 'Kulki serowe panierowane Cheese Balls 1 kg',
        allergens: 'gluten, mleko i jego pochodne',
      },
      { name: 'Sos meksykański 1 kg', allergens: 'gorczyca' },
      { name: 'Stripsy z kurczaka crispy mrożone 1,5 kg', allergens: 'gluten' },
      { name: 'Ser grillowy typu halloumi 200 g', allergens: 'mleko i jego pochodne' },
      {
        name: 'Chrupiący ser panierowany mrożony 125 g x 28 szt. 3,5 kg',
        allergens: 'jaja, gluten, mleko i jego pochodne',
      },
      { name: 'Szynka wykwintna plastry ok. 500 g', allergens: 'soja' },
      { name: 'Sałatka szwedzka 2,5/1,2 kg', allergens: 'gorczyca' },
      {
        name: 'Ser cheddar topiony plastry (84 x 12 g) 1,033 kg',
        allergens: 'mleko i jego pochodne',
      },
    ],
    ru: [
      { name: 'Луковые кольца в пивном кляре 1 кг', allergens: 'глютен, молоко и его производные' },
      { name: 'Сыр Грана Падано Del Casale DOP ок. 1 кг', allergens: 'яйца' },
      { name: 'Соус сальса мексиканская 1 кг', allergens: 'глютен, соя' },
      { name: 'Филе анчоусов 78/42 г', allergens: 'рыба' },
      { name: 'Паста из перца чили Гочуджан 500 г', allergens: 'глютен, соя' },
      { name: 'Декоративный майонез 10 г x 120 шт.', allergens: 'горчица, яйца' },
      { name: 'Куриные наггетсы хрустящие замороженные 1,5 кг', allergens: 'глютен' },
      { name: 'Жареный лук 500 г', allergens: 'глютен' },
      { name: 'Майонез 5 кг', allergens: 'горчица, яйца' },
      { name: 'Палочки из сыра моцарелла 1 кг', allergens: 'глютен, молоко и его производные' },
      { name: 'Панированные сырные шарики 1 кг', allergens: 'глютен, молоко и его производные' },
      { name: 'Мексиканский соус 1 кг', allergens: 'горчица' },
      { name: 'Куриные стрипсы хрустящие замороженные 1,5 кг', allergens: 'глютен' },
      { name: 'Сыр для гриля типа халлуми 200 г', allergens: 'молоко и его производные' },
      {
        name: 'Хрустящий панированный сыр замороженный 125 г x 28 шт. 3,5 кг',
        allergens: 'яйца, глютен, молоко и его производные',
      },
      { name: 'Изысканная ветчина ломтики ок. 500 г', allergens: 'соя' },
      { name: 'Шведский салат 2,5/1,2 кг', allergens: 'горчица' },
      {
        name: 'Сыр чеддер плавленый ломтики (84 x 12 г) 1,033 кг',
        allergens: 'молоко и его производные',
      },
    ],
  };

  return (
    <div className="allergens">
      <h1>{t('allergens.title')}</h1>
      <table>
        <thead>
          <tr>
            <th>{t('allergens.product')}</th>
            <th>{t('allergens.allergens')}</th>
          </tr>
        </thead>
        <tbody>
          {allergensData[i18n.language].map((item, index) => (
            <tr key={index}>
              <td>
                <strong>{item.name}</strong>
              </td>
              <td>{item.allergens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Allergens;
