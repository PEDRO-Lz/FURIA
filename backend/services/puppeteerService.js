import puppeteer from 'puppeteer';

export const obterUltimosJogos = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://draft5.gg/equipe/330-FURIA/resultados', { waitUntil: 'networkidle2' });

    const dados = await page.evaluate(() => {
      const ultimosJogosElements = Array.from(document.querySelectorAll('.MatchCardSimple__MatchContainer-sc-wcmxha-0.kSyLSS'));

      const ultimosJogos = ultimosJogosElements.slice(0, 4).map(jogo => {
        const adversario = jogo.querySelector('.MatchCardSimple__MatchTeam-sc-wcmxha-11.jEGFJI:nth-child(2) span')?.textContent || 'Adversário não encontrado';
        const placarTime1 = jogo.querySelector('.MatchCardSimple__MatchTeam-sc-wcmxha-11.jEGFJI .MatchCardSimple__Score-sc-wcmxha-15')?.textContent || '0';
        const placarTime2 = jogo.querySelector('.MatchCardSimple__MatchTeam-sc-wcmxha-11.jEGFJI:nth-child(2) .MatchCardSimple__Score-sc-wcmxha-15')?.textContent || '0';
        const placar = `${placarTime1}-${placarTime2}`;
        const hora = jogo.querySelector('.MatchCardSimple__MatchTime-sc-wcmxha-3.jtRBhV span')?.textContent || 'Hora não encontrada';
        const logoTime1 = jogo.querySelector('.MatchCardSimple__MatchTeam-sc-wcmxha-11.jEGFJI img')?.src || 'Logo não encontrada';
        const logoTime2 = jogo.querySelector('.MatchCardSimple__MatchTeam-sc-wcmxha-11.jEGFJI:nth-child(2) img')?.src || 'Logo não encontrada';
        const revejaLink = jogo.getAttribute('href') ? `https://draft5.gg${jogo.getAttribute('href')}` : 'Link não encontrado';

        return { adversario, placar, hora, logoTime1, logoTime2, revejaLink };
      });

      let proximoJogo = null;
      const datas = Array.from(document.querySelectorAll('.MatchList__MatchListDate-sc-1pio0qc-0.kPJtEq'));

      if (datas.length > 0) {
        const proximaDataTexto = datas[0].textContent.trim().replace('📅', '').trim();
        proximoJogo = {
          adversario: 'A definir',
          data: proximaDataTexto,
          hora: 'A definir',
        };
      }

      return { ultimosJogos, proximoJogo };
    });

    return dados;
  } catch (error) {
    throw new Error('Erro no scraping: ' + error.message);
  } finally {
    await browser.close();
  }
};
