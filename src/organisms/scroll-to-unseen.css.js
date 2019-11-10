import { css } from 'lit-element';

export const style = css`
  :host .wrapper .banner {
    border-radius: 5px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    left: 0;
    padding: 8px 16px 8px 16px;
    position: absolute;
    right: 0;
    transition: 0.25s ease-in opacity;
    user-select: none;
  }

  :host .wrapper .banner.inactive {
    opacity: 0;
    z-index: -1;
  }

  :host .wrapper .banner.top {
    top: 5px;
  }

  :host .wrapper .banner.bottom {
    bottom: 5px;
  }

  :host .wrapper .banner.new {
    background: #48a1e6;
  }

  :host .wrapper .banner.recent {
    background: #b8b8b8;
  }

  :host .wrapper .banner .icon {
    display: inline-block;
    position: relative;
    right: -10px;
    top: 3px;
  }

  :host .wrapper .banner.new .icon {
    right: -3px;
  }
`;
