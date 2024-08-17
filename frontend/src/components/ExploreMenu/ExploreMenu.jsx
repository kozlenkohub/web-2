import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1 className="h1e t2 logotext">Poznaj nasze menu</h1>
      <div className="working-hours">
        <p>Dostawa: Pn-Czw 11:00 - 20:30, Pt-Nd 11:00 - 21:30</p>
        <p>Grillujemy dla Was: Pn-Czw 11:00 - 21:00, Pt-Nd 11:00 - 22:00</p>
      </div>
      <div className="block-text">
        <p className="explore-menu-text t6 substext">Amerykan street food...</p>
      </div>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) => (prev === item.menu_name ? 'All' : item.menu_name))
              }
              key={index}
              className="explore-menu-list-item">
              <img
                className={category === item.menu_name ? 'active' : ''}
                src={item.menu_image}
                alt=""
              />
              <p className="item_menu t2 fz20">{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
