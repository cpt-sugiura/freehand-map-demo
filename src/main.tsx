import React from 'react';
import { render } from 'react-dom';
import './main.css';
import { FreeHandMap } from './FreeHandMap';
import { DownloadBtn } from './DownloadBtn';

document.addEventListener('DOMContentLoaded', function () {
  const divEl = document.createElement('div');
  divEl.id = 'react-root';
  render(
    <>
      <h3>地図上にマウスのドラッグ&ドロップで任意の線が引けます</h3>
      <DownloadBtn query={'#map'} />
      <FreeHandMap
        center={{
          lat: 34.722,
          lng: 137.699,
        }}
      />
    </>,
    document.body.appendChild(divEl)
  );
});
