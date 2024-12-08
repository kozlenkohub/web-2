import React from 'react';
import './Allergens.css';
import { useTranslation } from 'react-i18next';

const Allergens = () => {
  const { t, i18n } = useTranslation();

  const allergensData = {
    en: [
      { name: 'Onion rings in beer batter', allergens: 'gluten, milk and its derivatives' },
      { name: 'Grana Padano Del Casale DOP cheese', allergens: 'eggs' },
      { name: 'Mexican salsa sauce', allergens: 'gluten, soy' },
      { name: 'Anchovy fillets', allergens: 'fish' },
      { name: 'Chili pepper paste Gochujang', allergens: 'gluten, soy' },
      { name: 'Decorative mayonnaise', allergens: 'mustard, eggs' },
      { name: 'Crispy frozen chicken nuggets', allergens: 'gluten' },
      { name: 'Fried onions', allergens: 'gluten' },
      { name: 'Mayonnaise', allergens: 'mustard, eggs' },
      { name: 'Mozzarella cheese sticks', allergens: 'gluten, milk and its derivatives' },
      { name: 'Breaded cheese balls', allergens: 'gluten, milk and its derivatives' },
      { name: 'Mexican sauce', allergens: 'mustard' },
      { name: 'Crispy frozen chicken strips', allergens: 'gluten' },
      { name: 'Grill cheese type halloumi', allergens: 'milk and its derivatives' },
      {
        name: 'Crispy breaded cheese frozen',
        allergens: 'eggs, gluten, milk and its derivatives',
      },
      { name: 'Exquisite ham slices', allergens: 'soy' },
      { name: 'Swedish salad', allergens: 'mustard' },
      { name: 'Cheddar cheese slices', allergens: 'milk and its derivatives' },
    ],
    pl: [
      { name: 'Krążki cebulowe w cieście piwnym', allergens: 'gluten, mleko i jego pochodne' },
      { name: 'Ser Grana Padano Del Casale DOP', allergens: 'jaja' },
      { name: 'Sos salsa mexicana', allergens: 'gluten, soja' },
      { name: 'Anchois filety', allergens: 'ryba' },
      { name: 'Pasta z papryczek chili Gochujang', allergens: 'gluten, soja' },
      { name: 'Majonez dekoracyjny', allergens: 'gorczyca, jaja' },
      { name: 'Nuggetsy z kurczaka crispy mrożone', allergens: 'gluten' },
      { name: 'Cebulka prażona', allergens: 'gluten' },
      { name: 'Majonez', allergens: 'gorczyca, jaja' },
      { name: 'Paluszki z sera mozzarella', allergens: 'gluten, mleko i jego pochodne' },
      {
        name: 'Kulki serowe panierowane Cheese Balls',
        allergens: 'gluten, mleko i jego pochodne',
      },
      { name: 'Sos meksykański', allergens: 'gorczyca' },
      { name: 'Stripsy z kurczaka crispy mrożone', allergens: 'gluten' },
      { name: 'Ser grillowy typu halloumi', allergens: 'mleko i jego pochodne' },
      {
        name: 'Chrupiący ser panierowany mrożony',
        allergens: 'jaja, gluten, mleko i jego pochodne',
      },
      { name: 'Szynka wykwintna plastry', allergens: 'soja' },
      { name: 'Sałatka szwedzka', allergens: 'gorczyca' },
      {
        name: 'Ser cheddar topiony plastry',
        allergens: 'mleko i jego pochodne',
      },
    ],
    ru: [
      { name: 'Луковые кольца в пивном кляре', allergens: 'глютен, молоко и его производные' },
      { name: 'Сыр Грана Падано Del Casale DOP', allergens: 'яйца' },
      { name: 'Соус сальса мексиканская', allergens: 'глютен, соя' },
      { name: 'Филе анчоусов', allergens: 'рыба' },
      { name: 'Паста из перца чили Гочуджан', allergens: 'глютен, соя' },
      { name: 'Декоративный майонез', allergens: 'горчица, яйца' },
      { name: 'Куриные наггетсы хрустящие замороженные', allergens: 'глютен' },
      { name: 'Жареный лук', allergens: 'глютен' },
      { name: 'Майонез', allergens: 'горчица, яйца' },
      { name: 'Палочки из сыра моцарелла', allergens: 'глютен, молоко и его производные' },
      { name: 'Панированные сырные шарики', allergens: 'глютен, молоко и его производные' },
      { name: 'Мексиканский соус', allergens: 'горчица' },
      { name: 'Куриные стрипсы хрустящие замороженные', allergens: 'глютен' },
      { name: 'Сыр для гриля типа халлуми', allergens: 'молоко и его производные' },
      {
        name: 'Хрустящий панированный сыр замороженный',
        allergens: 'яйца, глютен, молоко и его производные',
      },
      { name: 'Изысканная ветчина ломтики', allergens: 'соя' },
      { name: 'Шведский салат', allergens: 'горчица' },
      {
        name: 'Сыр чеддер плавленый ломтики',
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
