// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import { infoData } from 'src/data/general/data'

// ** Styled Components
import CustomHeader from 'src/@core/components/Header'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  createTheme
} from '@mui/material'
import { ExpandMore, Search } from '@mui/icons-material'

const theme = createTheme()

const DatabaseList = props => {
  const [chartData, setChartData] = useState([
    ...infoData.sort((a, b) => (a.desc > b.desc ? 1 : b.desc > a.desc ? -1 : 0))
  ])
  const [search, setSearch] = useState({ found: true, search: null })

  useEffect(() => {
    const timeoutId = setTimeout(() => {}, 1500)

    return () => clearTimeout(timeoutId)
  }, [search])

  const handleFilterSearch = input => {
    const searchString = input.target.value

    if (searchString.length === 0 || searchString === null) {
      setChartData([...infoData])
      setSearch({ found: true, search: searchString })

      return
    }

    const newChartData = []

    ;[...infoData].forEach(info => {
      const infoStr = info.desc.toString().toLocaleLowerCase()
      const searchData = `${infoStr} ${info.key}`
      if (searchData.search(searchString.toLocaleLowerCase()) > -1) {
        newChartData.push(info)
      }
    })

    if (newChartData?.length > 0) {
      setChartData(newChartData)
      setSearch({ found: true, search: searchString ?? '' })
    } else {
      setChartData([])
      setSearch({ found: false, search: searchString ?? '' })
    }
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CustomHeader icon='database' title='DATABASE LISTS' />
            <Divider />
          </Card>
        </Grid>
      </Grid>
      <>
        <Card>
          <Grid container spacing={3} style={{ minWidth: '320px', padding: '1rem' }}>
            <Grid item xs={12} md={6} lg={8}>
              <Paper elevation={12} sx={{ padding: '1rem' }}>
                <Paper
                  elevation={12}
                  component='form'
                  sx={{
                    padding: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '250px',
                    marginBottom: '10px'
                  }}
                >
                  <InputBase
                    sx={{
                      marginLeft: theme.spacing(1),
                      flex: 1,
                      width: '75px'
                    }}
                    placeholder='Data Filter'
                    inputProps={{ 'aria-label': 'filter information' }}
                    onChange={handleFilterSearch}
                  />
                  <Divider orientation='vertical' />
                  <IconButton type='submit' aria-label='search'>
                    <Search />
                  </IconButton>
                </Paper>
                {!search.found && (
                  <>
                    <Divider />
                    <div style={{ marginBottom: '10px' }}></div>

                    <Typography variant='body2' align='center'>
                      {`There are not results for "${search.search}"`}
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
          {chartData.length > 0 && (
            <Grid container spacing={3} style={{ minWidth: '240px' }}>
              <Grid item key='header-accordions' xs={12} md={7} lg={8}>
                <Paper
                  key='sub-header-accordions'
                  sx={{
                    padding: theme.spacing(2),
                    display: 'flex',
                    overflow: 'auto',
                    flexDirection: 'column',
                    minHeight: '145px',
                    minWidth: '115px',
                    height: '100%',
                    justifyContent: 'center'
                  }}
                >
                  {chartData.map(chart => {
                    let totalQuantity = 0
                    const chartName = chart.desc
                    const info = chart.info

                    return (
                      <>
                        <Accordion square style={{ minWidth: '240px' }}>
                          <AccordionSummary
                            expandIcon={<ExpandMore color='primary' />}
                            aria-controls='normal-content'
                            id={`normal-header-${chart.slot}`}
                            style={{ minWidth: '240px' }}
                          >
                            <Typography color='primary'>{chartName}</Typography>
                            <Divider />
                          </AccordionSummary>
                          <AccordionDetails style={{ minWidth: '240px' }}>
                            {
                              <div style={{ minWidth: '240px' }}>
                                <TableContainer>
                                  <Table
                                    key={`${chart.slot}-${chart.key}`}
                                    aria-labelledby='tableTitle'
                                    size={'small'}
                                    aria-label='enhanced table'
                                  >
                                    <TableBody style={{ minWidth: '240px' }}>
                                      {/* HEADER */}
                                      <TableRow>
                                        <TableCell align='center'>{`Level`}</TableCell>
                                        <TableCell align='center'>{`${chart.key} needed`}</TableCell>
                                        <TableCell align='center'>{`Total Needed From Lv0`}</TableCell>
                                        <TableCell align='center'>{`Extra Info`}</TableCell>
                                      </TableRow>

                                      {/* DETAILS */}
                                      {info.map(row => {
                                        totalQuantity =
                                          totalQuantity +
                                          (typeof row.quantity === 'number' ? row.quantity : row.extraQuantity)

                                        return (
                                          <>
                                            <TableRow>
                                              <TableCell align='center'>
                                                {
                                                  <Typography variant='body2' color='textPrimary'>
                                                    {row.level}
                                                  </Typography>
                                                }
                                              </TableCell>
                                              <TableCell align='center'>
                                                {
                                                  <Typography variant='body2' color='textPrimary'>
                                                    {row.quantity.toLocaleString()}
                                                  </Typography>
                                                }
                                              </TableCell>
                                              <TableCell align='center'>
                                                {
                                                  <Typography variant='body2' color='textPrimary'>
                                                    {typeof totalQuantity === 'number'
                                                      ? totalQuantity.toLocaleString()
                                                      : ''}
                                                  </Typography>
                                                }
                                              </TableCell>

                                              {row?.info && (
                                                <TableCell align='center'>
                                                  {
                                                    <Typography variant='body2' color='textPrimary'>
                                                      {row.info}
                                                    </Typography>
                                                  }
                                                </TableCell>
                                              )}
                                            </TableRow>
                                          </>
                                        )
                                      })}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                            }
                          </AccordionDetails>
                        </Accordion>
                      </>
                    )
                  })}
                </Paper>
              </Grid>
            </Grid>
          )}
        </Card>
      </>
    </>
  )
}

export default DatabaseList
