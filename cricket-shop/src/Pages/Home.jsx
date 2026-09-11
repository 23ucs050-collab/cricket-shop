import { Link } from "react-router-dom";

function Home() {

  return (

    <div>

      <section className="hero">

        <div>

          <h1>
            Play Like a Champion
          </h1>

          <p>
            Premium cricket equipment for every player.
          </p>

          <Link to="/products">
            Shop Now
          </Link>

        </div>

      </section>

      <section className="home-info">

        <h2>Welcome to Cricket Shop 🏏</h2>

        <p>
          Find cricket bats, gloves, helmets,
          pads, shoes and more.
        </p>

      </section>

    </div>

  );
}

export default Home;