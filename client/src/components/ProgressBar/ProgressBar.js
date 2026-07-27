function ProgressBar({ value }) {

  return (

    <div className="progress-wrapper">

      <div className="progress-track">

        <div

          className="progress-fill"

          style={{

            width: `${value}%`

          }}

        />

      </div>

      <span>{value}%</span>

    </div>

  );

}

export default ProgressBar;