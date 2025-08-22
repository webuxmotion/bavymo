import { NavLink, Link, useLocation } from "react-router-dom";
import Logo from "../../icons/Logo";
import styles from './Header.module.scss';
import clsx from "clsx";

const LINKS = [
  { id: 0, title: "Video Chat", to: "/video-chat" },
  { id: 1, title: "Two in room", to: "/two-in-room" },
  { id: 2, title: "About", to: "/about" },
  { id: 3, title: "Contacts", to: "/contacts" },
];

export default function Header() {
  const location = useLocation();

  return (
    <div
      className={clsx(
        styles.wrapper,
        location.pathname === "/video-chat" && styles.chat
      )}
    >
      <div className={styles.inner}>
        <div>
          <Link to="/" className={styles.logo}>
            <Logo />
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul>
            {LINKS.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <NavLink
            to={'/profile'}
            className={({ isActive }) => {
              return clsx(
                styles.profileButton,
                isActive ? styles.active : undefined
              )
            }}
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}