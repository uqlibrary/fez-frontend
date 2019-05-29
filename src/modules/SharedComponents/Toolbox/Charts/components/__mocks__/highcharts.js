// Ref: https://gist.github.com/alfonsomunozpomer/2bcbbb89bcdb8e5b8ed7070654779d99
const highcharts = jest.genMockFromModule('highcharts');
highcharts.getOptions = () => ({ plotOptions: {} });
export default highcharts;
