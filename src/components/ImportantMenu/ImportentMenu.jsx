import React from 'react';
import { Link } from 'react-router';
import menuData from '../../../src/assets/link/importantMenuData.json';
import { FaPlay } from 'react-icons/fa'; 
import campus from '../../assets/images/campus.webp';
import admission from '../../assets/images/admission.webp';
import scholarShip from '../../assets/images/scholarship.webp';
import academic from '../../assets/images/academic.webp';
import examination from '../../assets/images/Examination.webp';
import result from '../../assets/images/GPA.webp';
import resource from '../../assets/images/resource.webp';
import gallery from '../../assets/images/gallery.webp';
import notice from '../../assets/images/notice.webp';
import course from '../../assets/images/coursel.webp';

const icons = [
  campus,
  admission,
  scholarShip,
  academic,
  examination,
  result,
  resource,
  gallery, 
  notice,
  course,
];

const ImportentMenu = () => {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {menuData.map((menu, index) => {
        const IconImage = icons[index];
        return (
          <div
            key={index}
            className="border border-gray-300 shadow bg-gray-300/10 p-5 flex items-start gap-4 hover:shadow-lg transition"
          >
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-2">{menu.title}</h3>
              <div className="flex gap-5 items-center">
                <div className="w-14 h-14 flex-shrink-0">
                  <img src={IconImage} alt={menu.title} className="w-full h-full object-contain" />
                </div>
                {/* Links */}
                <div>
                  <ul className="space-y-2 text-sm">
                    {menu.submenu.map((sub, i) => (
                      <li key={i} className={`flex items-center gap-2 ${sub.bg}`}>
                        <span className="text-green-800">
                          <FaPlay size={8} />
                        </span>
                        <Link
                          to={sub.target}
                          className="text-gray-700 hover:font-semibold hover:underline"
                        >
                          {sub.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImportentMenu;
