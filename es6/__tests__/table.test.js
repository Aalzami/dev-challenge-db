import SortedTable from '../table';
import sampleData from '../sampleData.json';

describe('Sorted Datatable', () => {

  it('should receive message, calculate midPrice, sort resultant data and render table', () => {
    const message = { body: JSON.stringify(sampleData)};
    document.body.innerHTML = `
      <div id=\"currency-table-body\">\n
        <div class=\"currency-table-row\"></div>\n
      </div>
    `;
    window.Sparkline = { draw: jest.fn() }
    const dataTable = new SortedTable();

    jest.spyOn(dataTable, 'receiveMessage');
    jest.spyOn(dataTable, 'calculateMidPrice');
    jest.spyOn(dataTable, 'sortTableData');
    jest.spyOn(dataTable, 'renderTable');
    jest.spyOn(dataTable, 'generateCell');
    jest.spyOn(dataTable, 'getSparklineData');

    // tests for receiveMessage()
    dataTable.receiveMessage(message);
    expect(dataTable.receiveMessage).toHaveBeenCalledTimes(1);
    expect(dataTable.receiveMessage).toHaveBeenCalledWith(message);

    // tests for methods to be called
    expect(dataTable.calculateMidPrice).toHaveBeenCalled();
    expect(dataTable.sortTableData).toHaveBeenCalled();
    expect(dataTable.renderTable).toHaveBeenCalled();
    expect(dataTable.generateCell).toHaveBeenCalled();
    expect(dataTable.getSparklineData).toHaveBeenCalledTimes(dataTable.dataArray.length);

    // ensure data is consistent
    expect(dataTable.indexArray).toContain(sampleData.name);
    const length = dataTable.dataArray.length;
    expect(dataTable.indexArray).toHaveLength(length);
    expect(dataTable.dataArray[length - 1]).toHaveProperty('name');
    expect(dataTable.dataArray[length - 1]).toHaveProperty('midPrice');
    expect(dataTable.dataArray[length - 1].name).toBe(sampleData.name);

    // check for template
    expect(document.getElementsByClassName('currency-table-cell')).toBeTruthy();
    expect(document.getElementsByClassName('currency-table-cell')).toHaveLength(6);
    expect(document.body.innerHTML).toMatchSnapshot();
  });

});