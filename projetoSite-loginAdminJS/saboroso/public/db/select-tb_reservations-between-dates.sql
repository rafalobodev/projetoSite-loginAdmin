SELECT -- query para o grafico de dados
	CONCAT(YEAR(date), '-', MONTH(date)) AS date,
    COUNT(*) AS total,
    SUM(people) / COUNT(*) AS avg_people
FROM tb_reservations
WHERE
	date BETWEEN '2017-09-24' AND '2018-09-24' -- duas datas
GROUP BY YEAR(date), MONTH(date)
ORDER BY YEAR(date) DESC, MONTH(date) DESC;