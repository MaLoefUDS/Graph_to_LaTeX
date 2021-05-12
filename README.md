Universal Code to create Graphs and convert them to LaTeX. Making use of the LaTeX library tikz.

## Usage

Clone this git repository to your local machine. Execute the `index.html` file using your browser. You get prompted with the UI of GtL.

![start-up screen](https://github.com/MaLoefUDS/Graph_to_LaTeX/blob/main/demo/Screenshot1.png "start-up screen")

Start creating your Graph. Buttons under **Drawing Functionality** provide you with objects like circles or rectangels to add to your Graph. Buttons under **Editing Functionality** allow you to change basic properties of the graph like grid alignment. Buttons under **Visual Functionality** give you visual customizability like switching between light and dark mode. 

![creating a graph](https://github.com/MaLoefUDS/Graph_to_LaTeX/blob/main/demo/Screenshot2.png "creating a graph")

When you are done you can export your Graph to a file using the `Safe Graph to File` button, or click the LaTeX button to copy the LaTeX code of your Graph directly to your clipboard!

## Setup

Include the tikz library in your .tex file 

```latex
\usepackage{tikz}
```

Now you can just paste your LaTeX code in. The result should look as follows:

![graph in latex](https://github.com/MaLoefUDS/Graph_to_LaTeX/blob/main/demo/Screenshot3.png "graph in latex")