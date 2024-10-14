import { useState } from "react";
import "./App.css";
import vieraskieliset_data from "../vieraskieliset.json";
import kaikki_data from "../kaikki.json";

import Autocomplete from "@mui/joy/Autocomplete";
import { FormControl, FormLabel } from "@mui/joy";

type SimpleDictionary = {
  [key: string]: number;
};

type PercentageBarProps = {
  value: string;
  vieraskielisten_prosentti: SimpleDictionary;
};

/* Formats data into dictionaries with the format: {"kunnan_nimi": lapsien_määrä} and returns said dictionaires. */
const dataParser = () => {
  const vieraskieliset_index =
    vieraskieliset_data["dimension"]["Alue"]["category"]["index"];
  const vieraskieliset_label =
    vieraskieliset_data["dimension"]["Alue"]["category"]["label"];
  const vieraskieliset_value = vieraskieliset_data["value"];

  const kaikki_index = kaikki_data["dimension"]["Alue"]["category"]["index"];
  const kaikki_label = kaikki_data["dimension"]["Alue"]["category"]["label"];
  const kaikki_value = kaikki_data["value"];

  const vieraskieliset: SimpleDictionary = Object.keys(
    vieraskieliset_index
  ).reduce((acc, key) => {
    const label =
      vieraskieliset_label[key as keyof typeof vieraskieliset_label];
    const index =
      vieraskieliset_index[key as keyof typeof vieraskieliset_index];
    const value = vieraskieliset_value[index];

    return { ...acc, [label]: value };
  }, {});

  const kaikki: SimpleDictionary = Object.keys(kaikki_index).reduce(
    (acc, key) => {
      const label = kaikki_label[key as keyof typeof kaikki_label];
      const index = kaikki_index[key as keyof typeof kaikki_index];
      const value = kaikki_value[index];

      return { ...acc, [label]: value };
    },
    {}
  );

  return { vieraskieliset, kaikki };
};

/** Calculates the percentage of foreign language children in early childhood education.
 * Percentages are rounded to the nearest whole number.
 * Returns dictionary: {"kunta" : vieraskielisten lasten osuus}
 */
const dataToPercentages = () => {
  const { vieraskieliset, kaikki } = dataParser();

  const vieraskielisten_prosentti: SimpleDictionary = Object.keys(
    vieraskieliset
  ).reduce((acc, key) => {
    const prosentti = Math.round(
      (vieraskieliset[key as keyof typeof vieraskieliset] /
        kaikki[key as keyof typeof kaikki]) *
        100
    );
    return { ...acc, [key]: prosentti };
  }, {});
  return vieraskielisten_prosentti;
};

const PercentageBar = ({
  value,
  vieraskielisten_prosentti,
}: PercentageBarProps) => {
  return (
    <>
      <li
        style={{
          display: "flex",
        }}
      >
        <p
          style={{
            margin: 0,
            padding: "0.5rem",
            textAlign: "left",
            fontWeight: "bold",
            width: "12rem",
          }}
        >
          {value}
        </p>
        <p
          style={{
            margin: 0,
            padding: "0.5rem",
            textAlign: "left",
            color: "white",
            fontWeight: "bold",
            backgroundColor: "#F57600",
            width: `${vieraskielisten_prosentti[value]}%`,
          }}
        >
          {vieraskielisten_prosentti[value]}%
        </p>
        <p
          style={{
            margin: 0,
            padding: "0.5rem",
            textAlign: "right",
            color: "white",
            fontWeight: "bold",
            backgroundColor: "#054FB9",
            width: `${100 - vieraskielisten_prosentti[value]}%`,
          }}
        >
          {100 - vieraskielisten_prosentti[value]}%
        </p>
      </li>
    </>
  );
};

function App() {
  const vieraskielisten_prosentti: SimpleDictionary = dataToPercentages();
  const kunnat = Object.keys(vieraskielisten_prosentti);

  const [values, setValues] = useState<string[] | undefined>([kunnat[0]]);
  const [inputValue, setInputValue] = useState("");

  return (
    <section style={{ background: "#B3C7F7", padding: "1rem" }}>
      <h2 style={{ textAlign: "left" }}>
        Katso vieraskielisten lasten osuus varhaiskasvatuksessa omassa
        kunnassasi vuonna 2022
      </h2>
      <p style={{ textAlign: "left" }}>
        Ahvenanmaan kunnat on jätetty hakukoneesta pois tietojen puutteen
        vuoksi.
      </p>

      <FormControl>
        <FormLabel
          sx={{
            fontSize: "1rem",
          }}
        >
          Kunnat
        </FormLabel>
        <Autocomplete
          sx={{
            border: "1px solid",
          }}
          multiple
          options={kunnat}
          value={values}
          onChange={(event, newValue) => {
            setValues(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
        />
      </FormControl>

      <ul
        style={{
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {values?.map((value) => (
          <PercentageBar
            key={value}
            value={value}
            vieraskielisten_prosentti={vieraskielisten_prosentti}
          ></PercentageBar>
        ))}
      </ul>

      <p>Lähde: Tilastokeskus</p>
    </section>
  );
}

export default App;
