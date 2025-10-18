// frontend/src/AboutPage.jsx
import { 
  Container, Box, Typography, Paper, Grid, 
  Accordion, AccordionSummary, AccordionDetails 
} from "@mui/material";
import Link from "@mui/material/Link";   // ✅ This one
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Logo from "./assets/logo.png";

function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ mb: 6 }}
      >
        <Box
          component="img"
          src={Logo}
          alt="Outbreak Atlas Logo"
          sx={{ width: { xs: 160, md: 300 }, height: "auto", mb: 2 }}
        />
        <Typography variant="h3" fontWeight={700} color="primary">
          About Outbreak Atlas
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mt: 1, maxWidth: "700px" }}
        >
          Learn more about the purpose of the site, the data sources we use,
          and how to interpret the charts and reports. 
        </Typography>
        <Typography color="error" variant="subtitle1"  gutterBottom textAlign="center"  sx={{ fontWeight: 'bold', mb:5 }} >
        Please Note that CDC fluview data collection is currently delayed due to the USA governmental shutdown. Until the activities resume 
        please allow for further delays in CDC data.
      </Typography>
      </Box>

      {/* Info Sections */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Purpose
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Outbreak Atlas is a illness symptom tracking application that is designed to track community illness trends and
              empower users to report, monitor, and understand local outbreaks across the United States. 
              It allows users to see trends at three different levels of locality, national, state, and zipcode over a two month period.
              These trends are generated from two different sources of data detailed in the section below. Data is visualized via charts and graphs
              that are direct and easily digestable.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Data Sources
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="primary">
            1. CDC (Center for Disease Control) U.S. Outpatient Influenza-like Illness Surveillance Network (ILINet)
            </Typography>

            <Typography variant="body1" color="text.secondary">
              We combine official public health sources with self-reported data
              to give a richer, real-time picture of outbreaks. For public health data, we use data sourced from the CDC's Fluview Surveillance Network 
              <Link href="https://www.cdc.gov/fluview/" target="_blank" rel="noopener noreferrer" underline="hover"color="primary"> CDC FluView </Link> and obtained
              through Carnegie Melon University's Delphi Research Group Epidata API via the fluview API Endpoint.
              <Link href="https://delphi.cmu.edu/" target="_blank" rel="noopener noreferrer" underline="hover"color="primary"> CMU Delphi Group. </Link>
              <Link href="https://cmu-delphi.github.io/delphi-epidata/api/fluview.html" target="_blank" rel="noopener noreferrer" underline="hover"color="primary"> Delphi Epidata API Fluview. </Link>
              The CDC Fluview (ILInet) network is a surveillance network of ~ 3000 volunteer outpatient health services 
              (Clinics/Pediatric Clinics/Urgent Care/Ambulatory Care/Student Health Centers etc). These outpatient services report the number of patients seen,
              and the number of patients ill with a flu-like respiratory illness (ILI). This data is available at the national and state level.
              <Link href="https://www.cdc.gov/fluview/overview/index.html" target="_blank" rel="noopener noreferrer" underline="hover"color="primary"> Read more about the CDC influenza surveillance network here! </Link>
            </Typography>
              <Typography variant="subtitle1" gutterBottom color="primary">
            2. User Reported Symptoms from the Outbreak Atlas Database
             </Typography>
             
             <Typography variant="body1" color="text.secondary"> 
                We allow users to create a simple account and self report their own symptoms quickly and easily. These symptom reports include several common symptoms such as cough, cold, fever,
                nausea, chills, headache, fatigue etc. Users also report severity of symptoms (mild, moderate, severe), any associated temperature or fever in degrees °F, additional notes or comments,
                their zipcode and state where the symptoms occured, and they have the option to allow location services to take more precise coordinates of their report for mapping purposes. This allows 
                for symptom data to be generated quickly by the user without the need for a doctor visit or testing confirmation. We then aggregate this data and can group it in various ways such as by symptoms, categories of symptoms
                such as dermal, respiratory, gastrointestinal etc, severity, state, and zipcode.  
              </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              How to Read the Charts
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Line charts show trends over time, such as how many reports per week or patient visits per week for a given locality.  Bar charts break down counts by
              category such as age group, and pie charts highlight proportions such as what portion of reports contained coughing or fever symptoms. We strive to make our reports simple and easy to read with minimal
              medical knowledge or jargon. However, when reading CDC flu surveillance data there are a few key terms to consider. Please see below.
              <Typography variant="subtitle1" gutterBottom color="primary"> 🔎 What is ILI or an ill patient?</Typography>
              <Typography variant="body1" color="text.secondary"> 
              When reading %/percentage of ill patient line graphs from the CDC, an ill patient (ILI/wILI) qualifies as having a fever/temperature ≥ 100°F/37.8°C plus an associated flu symptom
              such as a cough or sore throat. These reports are aggregated and also weighted (wILI) to account for differing population size and health provider coverage throughout different states.
              It is a faster paced system of illness surveillance which can be aggregated and calculated at much faster speeds that waiting for confirmed test cases (although the CDC does have this data in separate areas).
              Thus, one can interpret the percentage of wILI patients ill line graphs we display as a measure of number of patients with fever/temperature ≥ 100°F/37.8°C and flu-like respiratory symptoms as a total percentage of the number of patients seen at outpatient clinics, 
              then weighted for population.
              </Typography>
              <Typography variant="subtitle1" gutterBottom color="error"> 🚫 What is ILI is not!</Typography>
               <Typography variant="body1" color="text.secondary"> 
                It is not a laboratory confirmation of influenza virus. There is no swab or verification of viral nucleic acids (DNA/RNA) via PCR(Polymerase Chain Reaction) a paramount
                method to scientifically verify presence of the virus which was extensively used in covid 19 laboratory testing . Rather, it is outpatient symptom-based surveillance.
                Therefore, these symptoms could be caused by different illnesses such as RSV, covid, a cold or other common respiratory-based viruses or bacteria.
              </Typography>
              <Typography variant="subtitle1" gutterBottom color="secondary">📈 What does the "baseline" line mean on the flu charts?  </Typography>
               <Typography variant="body1" color="text.secondary"> 
                The baseline represents the expected level of influenza-like illness (ILI) in the U.S. during non-influenza weeks, as defined by the CDC. In other words, it’s the “normal background noise” of respiratory illness that happens every year, even outside of flu season.
                On our charts, the baseline is shown as a dashed horizontal line. If the observed percentage of patients with ILI rises above this line, it indicates that flu activity is higher than expected seasonal background levels.
              </Typography>
              <Typography variant="subtitle1" gutterBottom color="secondary">🤒🤧 How do I know if a given week or month is severe for flu activity?  </Typography>
               <Typography variant="body1" color="text.secondary"> 
                Severity is best judged by comparing the weekly or monthly weighted ILI percentage (% of patients visiting providers for flu-like symptoms) to the baseline:

                <Typography variant="body1" color="text.secondary"> ✅ Below the baseline → Flu activity is at or below normal background levels.</Typography>

                <Typography variant="body1" color="text.secondary">⚠️ Near the baseline → Flu activity may be increasing but is still typical.</Typography>

                 <Typography variant="body1" color="text.secondary">🔴 Above the baseline → Flu activity is elevated, suggesting the start or peak of a flu season.</Typography>

                <Typography variant="body1" color="text.secondary">📈 Far above the baseline (multiple points higher) → Indicates a severe or widespread flu season.</Typography>
              </Typography>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="secondary">
              A Call to Action! Help Us by Creating an Account and Reporting your Symptoms!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The power of user generated health reporting grows with the number of participants! For every report recieved our accuracy grows and with it 
              the practical usefulness of our data. As such, it would be a great help if you would consider creating a FREE account if our site is useful to you. 
              Thank you for visiting and interacting with Outbreak Atlas!!!!
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Privacy & Security
            </Typography>
            <Typography variant="body1" color="text.secondary">
              User privacy is our top priority. Reports are anonymized and
              personal details are never shared.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          align="center"
          color="primary"
        >
          Frequently Asked Questions
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Is my data anonymous?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Yes. We only collect minimal location info (state, zip) and
              symptom data. Your personal identity is never shared or exposed in
              reports or charts.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Where does the public health data come from?/What are your sources?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              We pull data from CDC ILINet and Delphi APIs, which provide
              influenza-like illness trends, combined with user reports in our
              system.
              <Link href="https://cmu-delphi.github.io/delphi-epidata/api/fluview.html" target="_blank" rel="noopener noreferrer" underline="hover"color="primary"> Delphi Epidata API Fluview. </Link>
              <Link href="https://delphi.cmu.edu/" target="_blank" rel="noopener noreferrer" underline="hover"color="primary"> CMU Delphi Group. </Link><Link href="https://www.cdc.gov/fluview/" target="_blank" rel="noopener noreferrer" underline="hover"color="primary"> CDC FluView/Illnet </Link>

            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How can I interpret the weekly charts?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Weekly line charts track trends from early weeks to the most
              recent. If the line is rising, cases are increasing; if it’s
              falling, they’re declining. Notably a baseline average is provided for the CDC based weekly flu like illness charts (2023-2024 wILI average). If cases are below this baseline there is
              below average activity for a given point in time. If cases are above this baseline then activity is above average. See additional explanations about how to read charts in the corresponding
              section above.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Do I need to log in to use the site?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
             Our National Trend data is viewable to anyone via the home page. Logging in lets you
              contribute your own reports, see details and summaries of your personal reports and see personalized local trends. In addition, registered
              users can generate their own queries for a given state or zipcode to get information on any locality that contains reports!
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>What is wILI and ILI on your CDC graphs? </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              <Typography variant="subtitle1" gutterBottom color="primary"> 🔎 What is ILI or an ill patient?</Typography>
              <Typography variant="body1" color="text.secondary"> 
              When reading %/percentage of ill patient line graphs from the CDC, an ill patient (ILI/wILI) qualifies as having a fever/temperature ≥ 100°F/37.8°C plus an associated flu symptom
              such as a cough or sore throat. These reports are aggregated and also weighted (wILI) to account for differing population size and health provider coverage throughout different states.
              It is a faster paced system of illness surveillance which can be aggregated and calculated at much faster speeds that waiting for confirmed test cases (although the CDC does have this data in separate areas).
              Thus, one can interpret the percentage of wILI patients ill line graphs we display as a measure of number of patients with fever/temperature ≥ 100°F/37.8°C and flu-like respiratory symptoms as a total percentage of the number of patients seen at outpatient clinics, 
              then weighted for population.
              </Typography>

              <Typography variant="subtitle1" gutterBottom color="error"> 🚫 What is ILI is not!</Typography>
               <Typography variant="body1" color="text.secondary"> 
                It is not a laboratory confirmation of influenza virus. There is no swab or verification of viral nucleic acids (DNA/RNA) via PCR(Polymerase Chain Reaction) a paramount
                method to scientifically verify presence of the virus which was extensively used in covid 19 laboratory testing . Rather, it is outpatient symptom-based surveillance.
                Therefore, these symptoms could be caused by different illnesses such as RSV, covid, a cold or other common respiratory-based viruses or bacteria.
              </Typography>
            </Typography>
          </AccordionDetails>
        </Accordion>

         <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>What does the "baseline" line mean on the flu charts?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
             The baseline represents the expected level of influenza-like illness (ILI) in the U.S. during non-influenza weeks, as defined by the CDC. In other words, it’s the “normal background noise” of respiratory illness that happens every year, even outside of flu season.
             On our charts, the baseline is shown as a dashed horizontal line. If the observed percentage of patients with ILI rises above this line, it indicates that flu activity is higher than expected seasonal background levels. This data is calculate from the 2023-2024 
             CDC ILInet data instead of the most current seasonal data.
            </Typography>
          </AccordionDetails>
        </Accordion>
        
          <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I know if a given week or month is severe for flu activity? </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
             Severity is best judged by comparing the weekly or monthly weighted ILI percentage (% of patients visiting providers for flu-like symptoms) to the baseline:

            ✅ Below the baseline → Flu activity is at or below normal background levels.

            ⚠️ Near the baseline → Flu activity may be increasing but is still typical.

            🔴 Above the baseline → Flu activity is elevated, suggesting the start or peak of a flu season.

            📈 Far above the baseline (multiple points higher) → Indicates a severe or widespread flu season.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How can I make an account? </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
             You can make an account by navigating to sign up button at top right of the screen in the nav bar.
            </Typography>
          </AccordionDetails>
        </Accordion>
          <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How is the goverment shut down effecting data? </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
             Unfortunately, the shutdown will be slowing additional data from the cdc flu surveillance network. So cdc data will be experiencing further delays over the next
             several weeks. The cases reported directly to our site will not be effected by the delay.
            </Typography>
          </AccordionDetails>
        </Accordion>

      </Box>
    </Container>
  );
}

export default AboutPage;
 