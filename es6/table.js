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
    const res = JSON.parse(message.body);
    this.calculateMidPrice(res);
    this.sortTableData();
    this.renderTable();
  }

  // Calculate midPrice and replacing old row with new row and store in array
  calculateMidPrice(res) {
    const midPrice = (res.bestBid + res.bestAsk) / 2;
    const index = this.indexArray.indexOf(res.name);
    if (~index) {
      // If previous entry is present for the received currency
      // Get the midPrice array and maintain latest 30 values
      const midPriceArray = this.dataArray[index].midPrice;
      if (midPriceArray.length >= 30) midPriceArray.shift();
      midPriceArray.push(midPrice);
      res.midPrice = midPriceArray;

      // Replace the old curreny value with new value
      this.dataArray[index] = res;
    } else {
      // Push into array and define midPrice if it is the first entry for the currency
      res.midPrice = [midPrice];
      this.indexArray.push(res.name);
      this.dataArray.push(res);
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
    const tableEl = document.getElementById('currency-table-body');
    tableEl.innerHTML = '';
    this.dataArray.forEach(row => {
      const tableRowEl = document.createElement('tr');
      tableRowEl.className = 'currency-table-row';

      this.generateCell(tableRowEl, row.name, 'currency-table-cell');
      this.generateCell(tableRowEl, row.bestBid, 'currency-table-cell align-right');
      this.generateCell(tableRowEl, row.bestAsk, 'currency-table-cell align-right');
      this.generateCell(tableRowEl, row.lastChangeBid, 'currency-table-cell align-right');
      this.generateCell(tableRowEl, row.lastChangeAsk, 'currency-table-cell align-right');

      const sparkCellEl = document.createElement('td');
      sparkCellEl.className = 'currency-table-cell align-right';
      const sparkElement = document.createElement('span')
      Sparkline.draw(sparkElement, row.midPrice)
      sparkCellEl.appendChild(sparkElement);
      tableRowEl.appendChild(sparkCellEl);

      tableEl.appendChild(tableRowEl);
    });
  }

  // Common method to create table cell element, assign text and append to the parent
  generateCell(parent, data, classNames) {
    const tableCellEl = document.createElement('td');
    tableCellEl.className = classNames;
    const text = document.createTextNode(data);
    tableCellEl.appendChild(text);
    parent.appendChild(tableCellEl);
  }
}
export default SortedTable;