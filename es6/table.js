class SortedTable {
  constructor() {
    this.indexArray = [];
    this.dataArray = [];
    this.receiveMessage = this.receiveMessage.bind(this);
    this.calculateMidPrice = this.calculateMidPrice.bind(this);
    this.sortTableData = this.sortTableData.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  // Receive response, parse it and perform operations
  receiveMessage(message) {
    const response = JSON.parse(message.body);
    this.calculateMidPrice(response);
    this.sortTableData();
    this.renderTable();
  }

  // Calculate midPrice and replacing old row with new row and store in array
  calculateMidPrice(response) {
    const timestamp = Date.parse(new Date());
    const midPrice = (response.bestBid + response.bestAsk) / 2;
    const index = this.indexArray.indexOf(response.name);

    if (~index) {
      // If previous entry is present for the received currency
      // Get the midPrice array and store value with timestamp
      const midPriceArray = this.dataArray[index].midPrice;
      midPriceArray.push([timestamp, midPrice]);
      response.midPrice = midPriceArray;

      // Replace the old curreny value with new value
      this.dataArray[index] = response;
    } else {
      // If it is the first entry for the currency
      response.midPrice = [[timestamp, midPrice]];
      this.indexArray.push(response.name);
      this.dataArray.push(response);
    }
  }

  // sort the array of currency based on the lastChangeBid
  sortTableData() {
    // Sort the currency array
    this.dataArray.sort((a, b) => a.lastChangeBid - b.lastChangeBid);
    // Refresh the index of the sorted data
    this.indexArray = this.dataArray.map(item => item.name);
  }

  // Dynamically generate table of data with its content
  renderTable() {
    const tableBodyEl = document.getElementById('currency-table-body');
    tableBodyEl.textContent = '';
    this.dataArray.forEach(row => {
      const tableRowEl = document.createElement('tr');
      tableRowEl.className = 'currency-table-row';

      // create cells for text values
      const displayCells = ['name', 'bestBid', 'bestAsk', 'lastChangeBid', 'lastChangeAsk'];
      displayCells.forEach(cell => this.generateCell(tableRowEl, row[cell], cell))

      // create cell for sparkline
      const sparkCellEl = document.createElement('td');
      sparkCellEl.className = 'currency-table-cell align-right';
      const sparkElement = document.createElement('span')

      // get sparkline array and append cell
      const sparklineData = this.getSparklineData(row.midPrice);
      Sparkline.draw(sparkElement, sparklineData);
      sparkCellEl.appendChild(sparkElement);
      tableRowEl.appendChild(sparkCellEl);

      tableBodyEl.appendChild(tableRowEl);
    });
  }

  // Common method to create table cell element, assign text and append to the parent
  generateCell(parent, data, cell) {
    const tableCellEl = document.createElement('td');
    tableCellEl.className = 'currency-table-cell';
    if (cell !== 'name') tableCellEl.classList.add('align-right');
    const text = document.createTextNode(data);
    tableCellEl.appendChild(text);
    parent.appendChild(tableCellEl);
  }

  // get sparkline data array of values for the last 30 secs
  getSparklineData(data) {
    const timeLimit = Date.parse(new Date()) - 30000;
    return data.filter(timestamps => timestamps[0] > timeLimit).map(values => values[1]);
  }
}
export default SortedTable;