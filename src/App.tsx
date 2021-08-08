import { RangeSlider } from './components/RangeSlider/RangeSlider';
import { VerticalRangeSlider } from './components/VerticalRangeSlider/VerticalRangeSlider';

function App() {
  return (
    <div>
      <RangeSlider
        initialValue={50}
        min={0}
        max={100}
        decimals={0}
        step={5}
        showTicks={true}
        snap={true}
        customLabels={[{ 0: "low" }, { 50: "medium" }, { 100: "high" }]}
        showLabel={true}
        prefix=""
        suffix=""
        rotateLabel={false}
        primaryColorLight="gray"
        primaryColor="black"
        width={800}
      />
      <VerticalRangeSlider
        initialValue={50}
        min={0}
        max={100}
        decimals={0}
        step={5}
        showTicks={true}
        snap={true}
        customLabels={[
          { 0: "zero" }, { 50: "fifty" }
        ]}
        showLabel={true}
        prefix=""
        suffix=""
        primaryColorLight="gray"
        primaryColor="black"
        height={800}
      />

    </div>
  );
}

export default App;
