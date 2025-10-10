    const weightSlider = document.getElementById('weight');
    const weightValue = document.getElementById('weightValue');
    const styleSlider = document.getElementById('style');
    const styleValue = document.getElementById('styleValue');

    weightSlider.addEventListener('input', () => {
      weightValue.textContent = `${weightSlider.value}g`;
    });

    styleSlider.addEventListener('input', () => {
      const styles = ['Softboiled', 'Medium', 'Hardboiled'];
      styleValue.textContent = styles[styleSlider.value - 1];
    });

    